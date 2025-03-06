import React from 'react';
import { FaHome, FaUsers, FaBriefcase, FaChartBar, FaFileAlt, FaCog, FaFileInvoice } from 'react-icons/fa';
import { FaChartLine } from "react-icons/fa6";
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <FaChartLine size={20} />
        </div>
        <span className="logo-text">CreditXpert</span>
      </div>
      
      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <SidebarItem icon={<FaHome size={18} />} label="Dashboard" />
          <SidebarItem icon={<FaUsers size={18} />} label="Customers" isActive={true} />
          <SidebarItem icon={<FaBriefcase size={18} />} label="Businesses" />
          <SidebarItem icon={<FaChartBar size={18} />} label="Analytics" />
          <SidebarItem icon={<FaFileAlt size={18} />} label="Reports" />
          <SidebarItem icon={<FaCog size={18} />} label="Settings" className="settings-item" />
        </ul>
      </nav>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ icon, label, isActive = false, className = '' }) => {
  return (
    <li className={className}>
      <a 
        href="#" 
        className={`sidebar-item ${isActive ? 'active' : ''}`}
      >
        <span className="item-icon">{icon}</span>
        <span className="item-label">{label}</span>
      </a>
    </li>
  );
};

export default Sidebar;