import React from 'react';
import './BusinessDashboard.css';
import { FiActivity, FiDollarSign, FiTrendingUp, FiCalendar } from 'react-icons/fi'; // Using Feather icons from react-icons

const BusinessDashboard = ({ 
  creditScore = 728,
  creditScoreChange = 6,
  loanEligibility = "₹24L",
  loanChange = "₹4L",
  riskAssessment = "Medium",
  riskImproved = true,
  nextReview = 15
}) => {
  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="business-dashboard">
      <header className="dashboard-header">
        <h1>Business Dashboard</h1>
        <span className="date">{formatDate()}</span>
      </header>
      
      <div className="dashboard-grid">
        {/* Credit Score Card */}
        <div className="dashboard-card">
          <div className="card-content">
            <div className="card-info">
              <h2 className="card-title">Credit Score</h2>
              <p className="card-value">{creditScore}</p>
              <p className={`card-change ${creditScoreChange >= 0 ? 'positive' : 'negative'}`}>
                {creditScoreChange >= 0 ? '+' : ''}{creditScoreChange} since last month
              </p>
            </div>
            <div className="card-icon credit-icon">
              <FiActivity size={24} />
            </div>
          </div>
        </div>
        
        {/* Loan Eligibility Card */}
        <div className="dashboard-card">
          <div className="card-content">
            <div className="card-info">
              <h2 className="card-title">Loan Eligibility</h2>
              <p className="card-value">{loanEligibility}</p>
              <p className="card-change positive">
                +{loanChange} since last month
              </p>
            </div>
            <div className="card-icon loan-icon">
              <FiDollarSign size={24} />
            </div>
          </div>
        </div>
        
        {/* Risk Assessment Card */}
        <div className="dashboard-card">
          <div className="card-content">
            <div className="card-info">
              <h2 className="card-title">Risk Assessment</h2>
              <p className="card-value">{riskAssessment}</p>
              <p className="card-change positive">
                Improved since last month
              </p>
            </div>
            <div className="card-icon risk-icon">
              <FiTrendingUp size={24} />
            </div>
          </div>
        </div>
        
        {/* Next Review Card */}
        <div className="dashboard-card">
          <div className="card-content">
            <div className="card-info">
              <h2 className="card-title">Next Review</h2>
              <p className="card-value">{nextReview} Days</p>
              <p className="card-change neutral">
                Upcoming since last month
              </p>
            </div>
            <div className="card-icon calendar-icon">
              <FiCalendar size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;