import React from 'react';
import './CompanyProfile.css';
import { FiUser, FiBriefcase, FiCalendar, FiMail, FiExternalLink } from 'react-icons/fi';

const CompanyProfile = ({
  companyName = "InnovateFin Technologies",
  taxId = "ABCD12345E",
  creditScore = 728,
  creditStatus = "Good",
  lastUpdated = "2023-12-15",
  founder = "Alex Johnson",
  foundedYear = "2019",
  industry = "Fintech",
  email = "founder@innovatefin.com",
  isApproved = true
}) => {
  return (
    <div className="company-profile-card">
      <div className="profile-header">
        <div>
          <h2>Company Profile</h2>
          {isApproved && <span className="approval-badge">Approved</span>}
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-main">
          <h1 className="company-name">{companyName}</h1>
          <p className="tax-id">TAN: {taxId}</p>
        </div>
        
        <div className="credit-info">
          <div className="credit-label">Credit Score</div>
          <div className="credit-status">{creditStatus}</div>
          <div className="credit-score">{creditScore}</div>
          <div className="last-updated">
            Last updated:<br />
            {lastUpdated}
          </div>
        </div>
      </div>
      
      <div className="profile-details">
        <div className="detail-row">
          <div className="detail-item">
            <div className="detail-icon founder-icon">
              <FiUser size={20} />
            </div>
            <div className="detail-content">
              <div className="detail-label">Founder</div>
              <div className="detail-value">{founder}</div>
            </div>
          </div>
          
          <div className="detail-item">
            <div className="detail-icon industry-icon">
              <FiBriefcase size={20} />
            </div>
            <div className="detail-content">
              <div className="detail-label">Industry</div>
              <div className="detail-value">{industry}</div>
            </div>
          </div>
        </div>
        
        <div className="detail-row">
          <div className="detail-item">
            <div className="detail-icon founded-icon">
              <FiCalendar size={20} />
            </div>
            <div className="detail-content">
              <div className="detail-label">Founded</div>
              <div className="detail-value">{foundedYear}</div>
            </div>
          </div>
          
          <div className="detail-item">
            <div className="detail-icon email-icon">
              <FiMail size={20} />
            </div>
            <div className="detail-content">
              <div className="detail-label">Email</div>
              <div className="detail-value">{email}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="profile-footer">
        <a href="#" className="view-profile-link">
          View Full Profile <FiExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};

export default CompanyProfile;