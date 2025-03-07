import React, { useState, useEffect } from 'react';
import { FaUsers, FaExclamationTriangle, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import './StatsCards.css';

const StatsCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="stats-card">
      <div className="stats-header">
        <span className="stats-title">{title}</span>
        <div className={`stats-icon ${title.toLowerCase().includes('high') ? 'icon-red' : 
                                    title.toLowerCase().includes('low') ? 'icon-green' : 
                                    title.toLowerCase().includes('medium') ? 'icon-yellow' : 'icon-blue'}`}>
          {icon}
        </div>
      </div>
      
      <div className="stats-value">{value}</div>
      
      {subtitle && <div className="stats-subtitle">{subtitle}</div>}
    </div>
  );
};

const StatsCards = ({ highRisk, lowRisk, midRisk }) => {
  // Calculate total customers
  const totalCustomers = (highRisk || 0) + (lowRisk || 0) + (midRisk || 0);
  
  // Calculate average credit score (this is just an example calculation)
  // You would replace this with actual data from your API
  const [avgCreditScore, setAvgCreditScore] = useState(671);
  
  useEffect(() => {
    // You could fetch this data from an API if needed
    // For now, just a placeholder calculation based on risk distribution
    if (totalCustomers > 0) {
      // This is just an example formula - replace with your actual calculation
      const estimatedScore = Math.round(
        ((lowRisk || 0) * 780 + (midRisk || 0) * 650 + (highRisk || 0) * 550) / totalCustomers
      );
      setAvgCreditScore(estimatedScore || 671); // Default to 671 if calculation results in NaN
    }
  }, [highRisk, lowRisk, midRisk, totalCustomers]);

  return (
    <div className="stats-cards-container">
      <StatsCard 
        title="Total Customers" 
        value={totalCustomers.toString()}
        subtitle="Active business accounts" 
        icon={<FaUsers size={20} />} 
      />
      
      <StatsCard 
        title="High Risk Customers" 
        value={highRisk?.toString() || "0"}
        icon={<FaExclamationTriangle size={20} />} 
      />
      
      <StatsCard 
        title="Medium Risk Customers" 
        value={midRisk?.toString() || "0"}
        icon={<FaExclamationTriangle size={20} />} 
      />
      
      <StatsCard 
        title="Low Risk Customers" 
        value={lowRisk?.toString() || "0"}
        icon={<FaCheckCircle size={20} />} 
      />
    </div>
  );
};

export default StatsCards;