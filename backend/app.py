import traceback
import pandas as pd
import numpy as np
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
import pymysql.cursors
import os
from dotenv import load_dotenv
import json
from datetime import datetime


# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:5173",  # Allow only your frontend origin
        "methods": ["GET", "POST", "OPTIONS"],  # Explicitly allow methods
        "allow_headers": ["Content-Type", "Authorization"]  # Allow specific headers
    }
})

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


API_KEY = os.getenv("API_KEY")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

# @app.route('/cibil_loan_details',methods=['POST'])
def chat(loan_cibil):
    try:
        prompt = loan_cibil
        if not prompt:
            return jsonify({"error": "Prompt is required"}, status=400)

        headers = {"Content-Type": "application/json"}
        data = {
            "contents": [{"parts": [{"text": f"This is my data {loan_cibil} can you please give me concise upto 5-6 key points why i m getting this much and give me the key points in numbered list"}]}]
        }

        response = requests.post(GEMINI_URL, headers=headers, json=data)
            
        response_data = response.json()
        
        print("Gemini API Response:", response_data)  # ✅ Debugging

        # ✅ Ensure response_data contains 'candidates' instead of 'contents'
        if "candidates" in response_data and len(response_data["candidates"]) > 0:
            candidate = response_data["candidates"][0]

            if "content" in candidate and "parts" in candidate["content"] and len(candidate["content"]["parts"]) > 0:
                response_text = candidate["content"]["parts"][0]["text"]
                response_text = response_text.replace("**","")
                print(response_text)

                key_points = []
                lines = response_text.split("\n")

                for line in lines:
                    if line.strip() and line[0].isdigit():  # Check if line starts with a number
                        key_points.append(line.strip())

                
                return key_points

        return None

    except Exception as e:
        print("Exception:", str(e))  # ✅ Print error message
        print(traceback.format_exc())  # ✅ Print full error traceback
        return jsonify({"error": str(e)}, status=500)


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
            
            # Create predictions table to store prediction history
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS prediction_history (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    business_id VARCHAR(50) NOT NULL,
                    input_data JSON NOT NULL,
                    credit_score FLOAT NOT NULL,
                    risk_category VARCHAR(20) NOT NULL,
                    predicted_loan FLOAT NOT NULL,
                    metadata JSON,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    user_id INT,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
                )
            """)
            
            # Check if the user_id column exists, if not add it
            cursor.execute("""
                SELECT COUNT(*) as count 
                FROM information_schema.columns 
                WHERE table_schema = DATABASE() 
                AND table_name = 'prediction_history' 
                AND column_name = 'user_id'
            """)
            column_exists = cursor.fetchone()['count'] > 0
            
            if not column_exists:
                cursor.execute("""
                    ALTER TABLE prediction_history 
                    ADD COLUMN user_id INT,
                    ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
                """)
                
        connection.commit()
    finally:
        connection.close()

# Function to save prediction data
def save_prediction(business_id, input_data, credit_score, risk_category, predicted_loan, metadata, user_id=None):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # First try to find a user with matching TAN number
            if user_id is None and 'TAN' in input_data:
                cursor.execute("SELECT id FROM users WHERE tan = %s", (input_data['TAN'],))
                user_result = cursor.fetchone()
                if user_result:
                    user_id = user_result['id']
            print("predicted_loan "+predicted_loan)
            cursor.execute("""
                INSERT INTO prediction_history 
                (business_id, input_data, credit_score, risk_category, predicted_loan, metadata, user_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                business_id, 
                json.dumps(input_data), 
                credit_score, 
                risk_category, 
                predicted_loan,
                json.dumps(metadata) if metadata else None,
                user_id
            ))
        connection.commit()
        return True
    except Exception as e:
        print(f"Error saving prediction data: {str(e)}")
        return False
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
        print("Received data:", data)
        
        # Get user_id from token if available
        user_id = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            try:
                user_id = get_jwt_identity()
            except:
                # If token is invalid, just proceed without user_id
                pass

        # Convert JSON to DataFrame
        df_input = pd.DataFrame([data])

        # Store Business_ID separately since it's not needed for credit score prediction
        business_id = df_input.get('Business_ID', None)
        if isinstance(business_id, pd.Series):
            business_id = business_id.iloc[0]
            
        if 'Business_ID' in df_input.columns:
            df_input = df_input.drop(columns=['Business_ID'])

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

        # Make predictions for credit score
        rf_preds = rf.predict(X_selected)
        xgb_preds = xgb.predict(X_selected)
        lgbm_preds = lgbm.predict(X_selected)
        stacked_features = np.column_stack((rf_preds, xgb_preds, lgbm_preds))
        final_credit_score = meta_model.predict(stacked_features)[0]

        # Create a new DataFrame for loan prediction, including Business_ID
        df_loan_input = pd.DataFrame([data])  # Start fresh with original data
        df_loan_input['Credit_Score'] = final_credit_score  # Add the predicted credit score
        
        # Encode categorical variables again for loan model
        for col in ["Bank_Transactions", "Market_Trend"]:
            if col in df_loan_input:
                df_loan_input[col] = label_encoders[col].transform(df_loan_input[col])

        # Define expected columns for loan model
        expected_columns = ["Business_ID", "Annual_Revenue", "Requested_Loan_Amount", "GST_Compliance",
                            "Past_Defaults", "Bank_Transactions", "Market_Trend", "Credit_Score"]
        
        # Ensure all expected columns are present (fill missing with defaults if necessary)
        for col in expected_columns:
            if col not in df_loan_input.columns:
                if col == "Business_ID" and business_id is not None:
                    df_loan_input[col] = business_id
                else:
                    raise KeyError(f"Missing required column: {col}")

        df_loan_input = df_loan_input[expected_columns]  # Reorder columns

        # Apply scaling for loan model
        scaled_features = loan_scaler.transform(df_loan_input)

        # Predict loan amount
        final_loan = loan_model.predict(scaled_features)[0]
        print("Predicted loan amount:", final_loan)

        # Convert credit score to risk category
        risk_category = categorize_risk(final_credit_score)
        print("Final credit score:", final_credit_score, "Risk category:", risk_category, "Predicted loan:", final_loan)
        
        # Get analysis from Gemini
        metadata = chat(df_input.to_json())
        print(final_loan)
        # Save prediction data to database
        if business_id:
            save_prediction(
                business_id=business_id,
                input_data=data,
                credit_score=float(final_credit_score),
                risk_category=risk_category,
                predicted_loan=float(final_loan),
                metadata=metadata,
                user_id=user_id
            )
        
        # Return response
        return jsonify({
            "Credit_Score": round(final_credit_score, 2),
            "Risk_Category": risk_category,
            "Predicted_Loan": float(final_loan),
            "metadata": metadata
        })

    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": str(e)})

# Get prediction history for a business
@app.route("/prediction_history/<business_id>", methods=["GET"])
# @jwt_required()
def get_prediction_history(business_id):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT p.*, u.email, u.founder_name, u.company_name
                FROM prediction_history p
                LEFT JOIN users u ON p.business_id = u.tan
                WHERE p.business_id = %s
                ORDER BY p.created_at DESC
            """, (business_id,))
            history = cursor.fetchall()
            
            # Convert datetime objects to string for JSON serialization
            for record in history:
                record['created_at'] = record['created_at'].strftime('%Y-%m-%d %H:%M:%S')
                record['input_data'] = json.loads(record['input_data'])
                if record['metadata']:
                    record['metadata'] = json.loads(record['metadata'])
                    
            return jsonify({"history": history})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@app.route("/prediction_history/<history_id>", methods=["DELETE"])
# @jwt_required()
def delete_prediction_history(history_id):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                DELETE FROM prediction_history
                WHERE id = %s
                RETURNING id
            """, (history_id,))
            deleted_record = cursor.fetchone()
            
            if deleted_record:
                connection.commit()
                return jsonify({"message": "Prediction history record deleted successfully"}), 200
            else:
                return jsonify({"error": "Record not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@app.route("/all_prediction_history", methods=["GET"])
def get_all_prediction_history():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT p.*, u.email, u.founder_name as name, u.company_name as business
                FROM prediction_history p
                LEFT JOIN users u ON p.business_id = u.tan
                ORDER BY p.created_at DESC
            """)
            
            history = cursor.fetchall()
            
            # For records without linked user data, try to find matching TAN in input_data
            for record in history:
                # Check if user data is missing
                if record['email'] is None and record['name'] is None:
                    # Try to extract data from input_data if available
                    input_data = json.loads(record['input_data'])
                    
                    # Check if TAN exists in input_data
                    if 'TAN' in input_data:
                        tan = input_data['TAN']
                        # Look up user by TAN
                        cursor.execute("SELECT * FROM users WHERE tan = %s", (tan,))
                        user = cursor.fetchone()
                        if user:
                            record['email'] = user['email']
                            record['name'] = user['founder_name']
                            record['business'] = user['company_name']
                            record['predicted_loan'] = user['predicted_loan']
                    
                    # If still missing, use values from input_data if available
                    if record['name'] is None and 'User_Name' in input_data:
                        record['name'] = input_data['User_Name']
                    if record['email'] is None and 'Email' in input_data:
                        record['email'] = input_data['Email']
                    if record['business'] is None and 'Business_Name' in input_data:
                        record['business'] = input_data['Business_Name']
                
                # Standardize JSON fields for frontend
                record['created_at'] = record['created_at'].strftime('%Y-%m-%d %H:%M:%S')
                record['input_data'] = json.loads(record['input_data'])
                if record['metadata']:
                    record['metadata'] = json.loads(record['metadata'])
                    
            return jsonify({"history": history})
    except Exception as e:
        print(f"Error fetching prediction history: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

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
            cursor.execute("SELECT * FROM users WHERE tan = %s OR email = %s", (tan, email))
            user = cursor.fetchone()
            if user:
                return jsonify({"error": "TAN or email already exists"}), 400
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
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            if not user or not bcrypt.check_password_hash(user['password'], password):
                return jsonify({"error": "Invalid email or password"}), 401
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


# chatbot 
@app.route('/chat',methods=['POST'])
def chat():
    try:
        prompt = request.data.get("prompt")
        if not prompt:
            return jsonify({"error": "Prompt is required"}, status=400)

        headers = {"Content-Type": "application/json"}
        data = {
            "contents": [{"parts": [{"text": prompt + " in a concise manner in 3 to 4 lines and simple for understanding"}]}]
        }

        response = requests.post(GEMINI_URL, headers=headers, json=data)

        response_data = response.json()
        
        print("Gemini API Response:", response_data)  # ✅ Debugging

        # ✅ Ensure response_data contains 'candidates' instead of 'contents'
        if "candidates" in response_data and len(response_data["candidates"]) > 0:
            candidate = response_data["candidates"][0]

            if "content" in candidate and "parts" in candidate["content"] and len(candidate["content"]["parts"]) > 0:
                response_text = candidate["content"]["parts"][0]["text"]
                return jsonify({"response": response_text}, status=200)

        return jsonify({"error": "Invalid API response structure"}, status=500)

    except Exception as e:
        print("Exception:", str(e))  # ✅ Print error message
        print(traceback.format_exc())  # ✅ Print full error traceback
        return jsonify({"error": str(e)}, status=500)
    
# Run the Flask app
if __name__ == '__main__':
    create_tables()
    app.run(debug=True)

# react frontend function
# import axios from "axios";

# const API_URL = "YOUR_BACKEND_API_URL/chat"; // Replace with actual backend URL

# export const fetchChatbotResponse = async (prompt) => {

    # prompt = prompt +  ithe context de mhnje keypoints concat karun
#   try {
#     const response = await axios.post(API_URL, { prompt });
#     return response.data.response; // Assuming backend returns { response: "text" }
#   } catch (error) {
#     console.error("Error fetching chatbot response:", error);
#     return "Error fetching response. Please try again.";
#   }
# };