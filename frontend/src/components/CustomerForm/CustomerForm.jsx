import React, { useState } from 'react';
import './CustomerForm.css';

const CustomerForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    TAN_Number: '',
    Annual_Revenue: '',
    Requested_Loan_Amount: '',
    GST_Compliance: '',
    Past_Defaults: 0,
    Bank_Transactions: 'Stable',
    Market_Trend: 'Growth',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format the data as needed before submission
    const submissionData = {
      ...formData,
      Annual_Revenue: Number(formData.Annual_Revenue),
      Requested_Loan_Amount: Number(formData.Requested_Loan_Amount),
      GST_Compliance: Number(formData.GST_Compliance),
      Past_Defaults: Number(formData.Past_Defaults),
    };
    
    onSubmit(submissionData);
  };

  if (!isOpen) return null;

  return (
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
              <input
                type="text"
                id="TAN_Number"
                name="TAN_Number"
                value={formData.TAN_Number}
                onChange={handleChange}
                required
                placeholder="e.g., ABCD12345E"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="Annual_Revenue">Annual Revenue (₹)</label>
              <input
                type="number"
                id="Annual_Revenue"
                name="Annual_Revenue"
                value={formData.Annual_Revenue}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="Requested_Loan_Amount">Requested Loan Amount (₹)</label>
              <input
                type="number"
                id="Requested_Loan_Amount"
                name="Requested_Loan_Amount"
                value={formData.Requested_Loan_Amount}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="GST_Compliance">GST Compliance (%)</label>
              <input
                type="number"
                id="GST_Compliance"
                name="GST_Compliance"
                value={formData.GST_Compliance}
                onChange={handleChange}
                min="0"
                max="100"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="Past_Defaults">Past Defaults</label>
              <input
                type="number"
                id="Past_Defaults"
                name="Past_Defaults"
                value={formData.Past_Defaults}
                onChange={handleChange}
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="Bank_Transactions">Bank Transactions</label>
              <select
                id="Bank_Transactions"
                name="Bank_Transactions"
                value={formData.Bank_Transactions}
                onChange={handleChange}
                required
              >
                <option value="Stable">Stable</option>
                <option value="Unstable">Unstable</option>
                <option value="Declining">Declining</option>
                <option value="Growing">Growing</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="Market_Trend">Market Trend</label>
              <select
                id="Market_Trend"
                name="Market_Trend"
                value={formData.Market_Trend}
                onChange={handleChange}
                required
              >
                <option value="Growth">Growth</option>
                <option value="Decline">Decline</option>
                <option value="Stable">Stable</option>
                <option value="Volatile">Volatile</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;