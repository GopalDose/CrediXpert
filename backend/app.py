import pandas as pd
import numpy as np
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
import pymysql.cursors
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configure MySQL
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', 'password')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'company_db')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key')

# Initialize extensions
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# MySQL connection
def get_db_connection():
   return pymysql.connect(
    host=os.getenv('MYSQL_HOST'),
    user=os.getenv('MYSQL_USER'),
    password=os.getenv('MYSQL_PASSWORD'),
    db=os.getenv('MYSQL_DB'),
    charset='utf8mb4',
    port=int(os.getenv('MYSQL_PORT', 3306)),  # Default to 3306 if not set
    cursorclass=pymysql.cursors.DictCursor
    )


# Define the file paths
credit_model_path = "credit_score_model.pkl"
loan_model_path = "loan_model.pkl"
loan_model_scaler_path = "loan_scaler.pkl"

# Check if files exist before loading
if os.path.exists(credit_model_path):
    with open(credit_model_path, "rb") as file:
        model_data = pickle.load(file)
else:
    raise FileNotFoundError(f"Missing file: {credit_model_path}")

if os.path.exists(loan_model_path):
    with open(loan_model_path, "rb") as file:
        loan_model = pickle.load(file)
    
    with open(loan_model_scaler_path, "rb") as scaler_file:
        loan_scaler = pickle.load(scaler_file)
else:
    raise FileNotFoundError(f"Missing file: {loan_model_path}")

# Extract components from the loaded model data
scaler = model_data.get("scaler")
imputer = model_data.get("imputer")
label_encoders = model_data.get("label_encoders")
feature_indices = model_data.get("feature_indices")
meta_model = model_data.get("meta_model")
rf = model_data.get("rf")
xgb = model_data.get("xgb")
lgbm = model_data.get("lgbm")

# Force models to run in single-thread mode to avoid subprocess issues
rf.set_params(n_jobs=1)
xgb.set_params(n_jobs=1)
lgbm.set_params(n_jobs=1)


# Create tables (run this once)
def create_tables():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Create users table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    tan VARCHAR(20) NOT NULL UNIQUE,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    company_name VARCHAR(255) NOT NULL,
                    founder_name VARCHAR(255) NOT NULL,
                    industry VARCHAR(255) NOT NULL,
                    founding_year INT NOT NULL
                )
            """)
        connection.commit()
    finally:
        connection.close()


# Risk categorization function
def categorize_risk(score):
    if score >= 750:
        return "Low Risk"
    elif score >= 600:
        return "Medium Risk"
    else:
        return "High Risk"

# Prediction route
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get JSON request data
        data = request.get_json()

        # Convert JSON to DataFrame
        df_input = pd.DataFrame([data])

        # Encode categorical variables
        for col in ["Bank_Transactions", "Market_Trend"]:
            if col in df_input:
                df_input[col] = label_encoders[col].transform(df_input[col])

        # Handle missing values
        df_input = pd.DataFrame(imputer.transform(df_input), columns=df_input.columns)

        # Scale features
        X_scaled = scaler.transform(df_input)

        # Select top features
        X_selected = X_scaled[:, feature_indices]

        # Make predictions
        rf_preds = rf.predict(X_selected)
        xgb_preds = xgb.predict(X_selected)
        lgbm_preds = lgbm.predict(X_selected)

        # Stack predictions and predict final credit score
        stacked_features = np.column_stack((rf_preds, xgb_preds, lgbm_preds))
        final_credit_score = meta_model.predict(stacked_features)[0]

       # Add missing Business_ID and Credit_Score columns
        df_input['Business_ID'] = 123
        df_input['Credit_Score'] = final_credit_score
        
        # Reorder columns to match the trained model's format
        expected_columns = ["Business_ID", "Annual_Revenue", "Requested_Loan_Amount", "GST_Compliance",
                            "Past_Defaults", "Bank_Transactions", "Market_Trend", "Credit_Score"]
        
        df_input = df_input[expected_columns]  # Ensure correct column order
        
        # Apply the same scaling used in training
        scaled_features = loan_scaler.transform(df_input)
        
        # Predict loan amount
        final_loan = loan_model.predict(scaled_features)[0]
        print(final_loan)
        # Convert credit score to risk category
        risk_category = categorize_risk(final_credit_score)
        
        # Return response
        return jsonify({
            "Credit_Score": round(final_credit_score, 2),
            "Risk_Category": risk_category,
            "Predicted Loan": float(final_loan)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)})



# Register a new user
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    tan = data.get('tan')
    email = data.get('email')
    password = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
    company_name = data.get('companyName')
    founder_name = data.get('founderName')
    industry = data.get('industry')
    founding_year = data.get('foundingYear')

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Check if TAN or email already exists
            cursor.execute("SELECT * FROM users WHERE tan = %s OR email = %s", (tan, email))
            user = cursor.fetchone()
            if user:
                return jsonify({"error": "TAN or email already exists"}), 400

            # Insert new user
            cursor.execute("""
                INSERT INTO users (tan, email, password, company_name, founder_name, industry, founding_year)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (tan, email, password, company_name, founder_name, industry, founding_year))
        connection.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# User login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Fetch user by email
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            if not user or not bcrypt.check_password_hash(user['password'], password):
                return jsonify({"error": "Invalid email or password"}), 401

            # Generate JWT token
            access_token = create_access_token(identity=user['id'])
            return jsonify({"access_token": access_token}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# Protected route (example)
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    return jsonify({"message": f"Hello, user {current_user_id}!"}), 200

# Run the Flask app
if __name__ == '__main__':
    create_tables()  # Create tables if they don't exist
    app.run(debug=True)