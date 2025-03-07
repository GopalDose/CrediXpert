import React, { useState } from 'react';
import './CustomerForm.css';
import PredictionResultPopup from '../PredictionResultPopup/PredictionResultPopup';

const CustomerForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    TAN_Number: '',
    Annual_Revenue: '',
    Requested_Loan_Amount: '',
    GST_Compliance: '',
    Past_Defaults: 0,
    Bank_Transactions: 'Stable',
    Market_Trend: 'Growth',
  });
  
  const [predictionResult, setPredictionResult] = useState(null);
  const [showPredictionPopup, setShowPredictionPopup] = useState(false);

  const bankTransactionTypes = ["Stable", "Unstable", "High Volume", "Low Volume", "Moderate"];
  const marketTrendTypes = ["Growth", "Declining", "Stable", "Volatile", "Emerging"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      Business_ID: formData.TAN_Number,
      Annual_Revenue: Number(formData.Annual_Revenue),
      Requested_Loan_Amount: Number(formData.Requested_Loan_Amount),
      GST_Compliance: Number(formData.GST_Compliance),
      Past_Defaults: Number(formData.Past_Defaults),
      Bank_Transactions: formData.Bank_Transactions,
      Market_Trend: formData.Market_Trend,
    };

    try {
      console.log('Data sent to /predict:', submissionData);

      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
      }

      const result = await response.json();
      // Enhance result object with request data for context
      const enhancedResult = {
        ...result,
        Requested_Loan_Amount: submissionData.Requested_Loan_Amount
      };
      
      // Prepare sample metadata if none is provided
      if (!result.metadata) {
        // Create sample reasons based on available data
        const reasons = [];
        
        if (submissionData.GST_Compliance >= 90) {
          reasons.push("Positive: High GST compliance rate");
        } else if (submissionData.GST_Compliance < 70) {
          reasons.push("Negative: Low GST compliance rate");
        }
        
        if (submissionData.Past_Defaults === 0) {
          reasons.push("Positive: No past defaults");
        } else if (submissionData.Past_Defaults > 2) {
          reasons.push("Negative: Multiple past defaults");
        }
        
        if (submissionData.Bank_Transactions === "Stable") {
          reasons.push("Positive: Stable bank transaction history");
        } else if (submissionData.Bank_Transactions === "Unstable") {
          reasons.push("Negative: Unstable bank transaction pattern");
        }
        
        if (submissionData.Market_Trend === "Growth") {
          reasons.push("Positive: Operating in a growth market");
        } else if (submissionData.Market_Trend === "Declining") {
          reasons.push("Negative: Operating in a declining market");
        }
        
        enhancedResult.metadata = { reasons };
      } else if (typeof result.metadata === 'string') {
        try {
          enhancedResult.metadata = JSON.parse(result.metadata);
        } catch (e) {
          // If parsing fails, create a wrapped structure
          enhancedResult.metadata = { reasons: [result.metadata] };
        }
      }
      
      setPredictionResult(enhancedResult);
      setShowPredictionPopup(true);
      setFormData({
        TAN_Number: '',
        Annual_Revenue: '',
        Requested_Loan_Amount: '',
        GST_Compliance: '',
        Past_Defaults: 0,
        Bank_Transactions: 'Stable',
        Market_Trend: 'Growth',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleClosePrediction = () => {
    setShowPredictionPopup(false);
    // Optional: close the form too if desired
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Add New Customer</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="TAN_Number">TAN Number</label>
                <input type="text" id="TAN_Number" name="TAN_Number" value={formData.TAN_Number} onChange={handleChange} required placeholder="e.g., ABCD12345E" />
              </div>
              <div className="form-group">
                <label htmlFor="Annual_Revenue">Annual Revenue (₹)</label>
                <input type="number" id="Annual_Revenue" name="Annual_Revenue" value={formData.Annual_Revenue} onChange={handleChange} min="0" required />
              </div>
              <div className="form-group">
                <label htmlFor="Requested_Loan_Amount">Requested Loan Amount (₹)</label>
                <input type="number" id="Requested_Loan_Amount" name="Requested_Loan_Amount" value={formData.Requested_Loan_Amount} onChange={handleChange} min="0" required />
              </div>
              <div className="form-group">
                <label htmlFor="GST_Compliance">GST Compliance (%)</label>
                <input type="number" id="GST_Compliance" name="GST_Compliance" value={formData.GST_Compliance} onChange={handleChange} min="0" max="100" required />
              </div>
              <div className="form-group">
                <label htmlFor="Past_Defaults">Past Defaults</label>
                <input type="number" id="Past_Defaults" name="Past_Defaults" value={formData.Past_Defaults} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label htmlFor="Bank_Transactions">Bank Transactions</label>
                <select id="Bank_Transactions" name="Bank_Transactions" value={formData.Bank_Transactions} onChange={handleChange} required>
                  {bankTransactionTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="Market_Trend">Market Trend</label>
                <select id="Market_Trend" name="Market_Trend" value={formData.Market_Trend} onChange={handleChange} required>
                  {marketTrendTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
              <button type="submit" className="submit-button">Add Customer</button>
            </div>
          </form>
        </div>
      </div>
      
      <PredictionResultPopup 
        isOpen={showPredictionPopup} 
        onClose={handleClosePrediction} 
        result={predictionResult} 
      />
    </>
  );
};

export default CustomerForm;