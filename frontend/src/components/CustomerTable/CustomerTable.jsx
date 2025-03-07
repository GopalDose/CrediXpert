import React, { useState, useEffect, useRef } from 'react';
import './CustomerTable.css';
import axios from 'axios'; // Make sure axios is installed
import PredictionResultPopup from '../PredictionResultPopup/PredictionResultPopup';

const CustomerTable = ({ setMidRisk, setLowRisk, setHighRisk }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    name: '',
    business: '',
    riskLevel: '',
    creditScore: '',
    limit: '',
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [originalCustomers, setOriginalCustomers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch customers from the API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // Get token from localStorage or wherever you store it
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:5000/all_prediction_history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Transform the data to match the table structure
        const transformedData = response.data.history.map((prediction, index) => {
          // Extract user details from input_data
          const businessData = prediction.input_data;
          console.log("prediction " +prediction);
          
          // Use joined user data if available, fall back to input_data
          return {
            id: prediction.id || index + 1,
            businessId: prediction.business_id,
            // Use user data from join if available, otherwise fall back to input data
            name: prediction.name || businessData.User_Name || `Customer ${index + 1}`,
            email: prediction.email || businessData.Email || `customer${index + 1}@example.com`,
            business: prediction.business || businessData.Business_Name || `Business ${prediction.business_id}`,
            riskLevel: prediction.risk_category,
            creditScore: Math.round(prediction.credit_score),
            limit: prediction.predicted_loan,
            metadata: prediction.metadata,
            createdAt: prediction.created_at,
            // Include other relevant fields
            annualRevenue: businessData.Annual_Revenue,
            requestedAmount: businessData.Requested_Loan_Amount,
            gstCompliance: businessData.GST_Compliance,
            pastDefaults: businessData.Past_Defaults,
            bankTransactions: businessData.Bank_Transactions,
            marketTrend: businessData.Market_Trend
          };
        });
        
        setCustomers(transformedData);
        setOriginalCustomers(transformedData);
        setLoading(false);
        
        // Update risk counts
        updateRiskCounts(transformedData);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Failed to fetch customer data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, []);

  // Update risk counts
  const updateRiskCounts = (data) => {
    const lowRiskCount = data.filter(customer => customer.riskLevel === 'Low Risk').length;
    const mediumRiskCount = data.filter(customer => customer.riskLevel === 'Medium Risk').length;
    const highRiskCount = data.filter(customer => customer.riskLevel === 'High Risk').length;
    
    // Update parent component with counts
    setLowRisk(lowRiskCount);
    setMidRisk(mediumRiskCount);
    setHighRisk(highRiskCount);
  };

  // Apply filters whenever the filters state changes
  useEffect(() => {
    let filteredData = [...originalCustomers];

    // Apply each filter
    if (filters.name) {
      filteredData = filteredData.filter(customer => 
        (customer.name && customer.name.toLowerCase().includes(filters.name.toLowerCase())) ||
        (customer.email && customer.email.toLowerCase().includes(filters.name.toLowerCase()))
      );
    }

    if (filters.business) {
      filteredData = filteredData.filter(customer => 
        customer.business && customer.business.toLowerCase().includes(filters.business.toLowerCase())
      );
    }

    if (filters.riskLevel) {
      filteredData = filteredData.filter(customer => 
        customer.riskLevel && customer.riskLevel.toLowerCase().includes(filters.riskLevel.toLowerCase())
      );
    }

    if (filters.creditScore) {
      filteredData = filteredData.filter(customer => 
        customer.creditScore && customer.creditScore.toString().includes(filters.creditScore)
      );
    }

    if (filters.limit) {
      filteredData = filteredData.filter(customer => 
        customer.limit && customer.limit.toString().includes(filters.limit)
      );
    }

    setCustomers(filteredData);
    // Update risk counts based on filtered data
    updateRiskCounts(filteredData);
  }, [filters, originalCustomers]);

  // Handle filter changes
  const handleFilterChange = (e, column) => {
    setFilters({
      ...filters,
      [column]: e.target.value,
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle dropdown toggle
  const toggleDropdown = (customerId) => {
    setActiveDropdown(activeDropdown === customerId ? null : customerId);
  };

  // Handle view action
  const handleView = (customer) => {
    console.log('Viewing customer:', customer);
    
    // Format the data to match what the popup expects
    const resultData = {
      Credit_Score: customer.creditScore,
      Risk_Category: customer.riskLevel,
      Predicted_Loan: customer.limit,
      Requested_Loan_Amount: customer.requestedAmount,
      metadata: customer.metadata,
      // Add any other fields needed by the popup
      Business_ID: customer.businessId,
      Annual_Revenue: customer.annualRevenue,
      GST_Compliance: customer.gstCompliance,
      Past_Defaults: customer.pastDefaults,
      Bank_Transactions: customer.bankTransactions,
      Market_Trend: customer.marketTrend,
    };
    console.log(resultData);
    
    // Set the selected customer and show the popup
    setSelectedCustomer(resultData);
    setShowPopup(true);
    setActiveDropdown(null);
  };

  // Handle delete action
  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        // Usually you would call an API to delete
        // await axios.delete(`http://localhost:5000/delete_prediction/${customerId}`);
        
        // For now, just update the UI
        const updatedCustomers = originalCustomers.filter(c => c.id !== customerId);
        setCustomers(updatedCustomers);
        setOriginalCustomers(updatedCustomers);
        updateRiskCounts(updatedCustomers);
        console.log('Customer record deleted:', customerId);
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer record');
      }
    }
    setActiveDropdown(null);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get risk level badge class
  const getRiskBadgeClass = (risk) => {
    switch (risk) {
      case 'Low Risk':
        return 'risk-badge low-risk';
      case 'Medium Risk':
        return 'risk-badge medium-risk';
      case 'High Risk':
        return 'risk-badge high-risk';
      default:
        return 'risk-badge';
    }
  };

  if (loading) {
    return <div className="loading">Loading customer data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="customer-table-container">
      <table className="customer-table">
        <thead>
          <tr>
            <th>
              <div className="th-content">
                <span>Name</span>
                <input
                  type="text"
                  placeholder="Filter name..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange(e, 'name')}
                  className="filter-input"
                />
              </div>
            </th>
            <th>
              <div className="th-content">
                <span>Business</span>
                <input
                  type="text"
                  placeholder="Filter business..."
                  value={filters.business}
                  onChange={(e) => handleFilterChange(e, 'business')}
                  className="filter-input"
                />
              </div>
            </th>
            <th>
              <div className="th-content">
                <span>Risk Level</span>
                <select
                  value={filters.riskLevel}
                  onChange={(e) => handleFilterChange(e, 'riskLevel')}
                  className="filter-select"
                >
                  <option value="">All</option>
                  <option value="Low Risk">Low Risk</option>
                  <option value="Medium Risk">Medium Risk</option>
                  <option value="High Risk">High Risk</option>
                </select>
              </div>
            </th>
            <th>
              <div className="th-content">
                <span>Credit Score</span>
                <input
                  type="text"
                  placeholder="Filter score..."
                  value={filters.creditScore}
                  onChange={(e) => handleFilterChange(e, 'creditScore')}
                  className="filter-input"
                />
              </div>
            </th>
            <th>
              <div className="th-content">
                <span>Loan Amount</span>
                <input
                  type="text"
                  placeholder="Filter amount..."
                  value={filters.limit}
                  onChange={(e) => handleFilterChange(e, 'limit')}
                  className="filter-input"
                />
              </div>
            </th>
            <th>
              <div className="th-content">
                <span>Actions</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">No customer data available</td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="customer-name">
                    <div>{customer.name}</div>
                    <div className="customer-email">{customer.email}</div>
                  </div>
                </td>
                <td>{customer.business}</td>
                <td>
                  <span className={getRiskBadgeClass(customer.riskLevel)}>
                    {customer.riskLevel === 'Low Risk' && <span className="icon">✓</span>}
                    {customer.riskLevel === 'Medium Risk' && <span className="icon">⚠</span>}
                    {customer.riskLevel === 'High Risk' && <span className="icon">⚫</span>}
                    {customer.riskLevel}
                  </span>
                </td>
                <td>
                  <div className={`credit-score ${customer.creditScore < 600 ? 'low-score' : 
                    customer.creditScore < 750 ? 'medium-score' : 'high-score'}`}>
                    {customer.creditScore}
                    <span className="total-score">/900</span>
                  </div>
                </td>
                <td>{formatCurrency(customer.limit)}</td>
                <td className="actions-cell">
                  <div className="dropdown-container" ref={activeDropdown === customer.id ? dropdownRef : null}>
                    <button 
                      className="action-button" 
                      onClick={() => toggleDropdown(customer.id)}
                    >
                      ⋯
                    </button>
                    {activeDropdown === customer.id && (
                      <div className="dropdown-menu">
                        <button 
                          className="dropdown-item"
                          onClick={() => handleView(customer)}
                        >
                          <span className="dropdown-icon">👁️</span> View
                        </button>
                        <button 
                          className="dropdown-item delete"
                          onClick={() => handleDelete(customer.id)}
                        >
                          <span className="dropdown-icon">🗑️</span> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {/* Prediction Result Popup */}
      <PredictionResultPopup 
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        result={selectedCustomer}
      />
    </div>
  );
};

export default CustomerTable;