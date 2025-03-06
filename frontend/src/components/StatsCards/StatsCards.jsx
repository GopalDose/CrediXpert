import React from 'react';
import { FaUsers, FaExclamationTriangle, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import './StatsCards.css';

const StatsCard = ({ title, value, subtitle, change, isPositive, icon }) => {
  const changeValue = change ? `${change}% from previous month` : '';
  const changeClass = isPositive === false ? 'change-negative' : 'change-positive';
  const changeIcon = isPositive === false ? '↓' : '↑';
  
  return (
    <div className="stats-card">
      <div className="stats-header">
        <span className="stats-title">{title}</span>
        <div className={`stats-icon ${title.toLowerCase().includes('high') ? 'icon-red' : 
                                    title.toLowerCase().includes('low') ? 'icon-green' : 'icon-blue'}`}>
          {icon}
        </div>
      </div>
      
      <div className="stats-value">{value}</div>
      
      {subtitle && <div className="stats-subtitle">{subtitle}</div>}
      
      {change && (
        <div className="stats-change">
          <span className={changeClass}>
            {changeIcon} {change}%
          </span>
          <span className="change-period">from previous month</span>
        </div>
      )}
    </div>
  );
};

const StatsCards = () => {
  return (
    <div className="stats-cards-container">
      <StatsCard 
        title="Total Customers" 
        value="8" 
        subtitle="Active business accounts" 
        change="+12.5" 
        isPositive={true}
        icon={<FaUsers size={20} />} 
      />
      
      <StatsCard 
        title="High Risk Customers" 
        value="2" 
        change="-3.8" 
        isPositive={false}
        icon={<FaExclamationTriangle size={20} />} 
      />
      
      <StatsCard 
        title="Low Risk Customers" 
        value="3" 
        change="+5.2" 
        isPositive={true}
        icon={<FaCheckCircle size={20} />} 
      />
      
      <StatsCard 
        title="Average Credit Score" 
        value="671" 
        change="+2.1" 
        isPositive={true}
        icon={<FaChartLine size={20} />} 
      />
    </div>
  );
};

export default StatsCards;