
# Load the saved model and preprocessing objects
with open("credit_score_model.pkl", "rb") as file:
    model_data = pickle.load(file)

scaler = model_data["scaler"]
imputer = model_data["imputer"]
label_encoders = model_data["label_encoders"]
feature_indices = model_data["feature_indices"]
meta_model = model_data["meta_model"]
rf = model_data["rf"]
xgb = model_data["xgb"]
lgbm = model_data["lgbm"]

# Define Flask app
app = Flask(_name_)

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

        # Convert credit score to risk category
        risk_category = categorize_risk(final_credit_score)

        # Return response
        return jsonify({
            "Credit_Score": round(final_credit_score, 2),
            "Risk_Category": risk_category
        })

    except Exception as e:
        return jsonify({"error": str(e)})