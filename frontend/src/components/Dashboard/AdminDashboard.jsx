import React, { useState } from 'react';
import './AdminDashboard.css';
import Sidebar from '../Sidebar/Sidebar';
import AdminHead from '../AdminHead/AdminHead';
import StatsCards from '../StatsCards/StatsCards';
import CustomerTable from '../CustomerTable/CustomerTable';
import CustomerForm from '../CustomerForm/CustomerForm';

const AdminDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [highRisk, setHighRisk] = useState(0)
  const [lowRisk, setLowRisk] = useState(0)
  const [midRisk, setMidRisk] = useState(0)

  const handleAddEntry = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="rightside">
        <AdminHead />
        <div className="data">
          <h1 className="heading">Dashboard</h1>
          <StatsCards highRisk={highRisk} lowRisk={lowRisk} midRisk={midRisk} />

          <div className="table-header">
            <h2 className="table-title">Customer Management</h2>
            <button className="add-entry-btn" onClick={handleAddEntry}>
              <span className="add-icon">+</span> Add New Customer
            </button>
          </div>

          <CustomerTable setHighRisk={setHighRisk} setLowRisk={setLowRisk} setMidRisk={setMidRisk} />

          {/* Customer Form Modal */}
          <CustomerForm
            isOpen={isFormOpen}
            onClose={handleCloseForm}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;