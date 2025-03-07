import React from 'react';
import BusinessDashboard from '../BusinessDashboard/BusinessDashboard';
import CompanyProfile from '../CompanyProfile/CompanyProfile';
import CreditScoreTimeline from '../CreditScoreTimeline/CreditScoreTimeline';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <BusinessDashboard />
      
      <div className="detail-section">
        <div className="detail-column">
          <CompanyProfile />
        </div>
        <div className="detail-column">
          <CreditScoreTimeline />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;