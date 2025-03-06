import React, { useState } from 'react'
import './AdminDashboard.css'
import Sidebar from '../Sidebar/Sidebar'
import AdminHead from '../AdminHead/AdminHead'
import StatsCards from '../StatsCards/StatsCards'
import CustomerTable from '../CustomerTable/CustomerTable'
import CustomerForm from '../CustomerForm/CustomerForm'

const AdminDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const handleAddEntry = () => {
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
  };
  
  const handleSubmitForm = (formData) => {
    // Process and save the new customer data
    console.log("New customer data:", formData);
    
    // Here you would typically make an API call to save the data
    // After successful save, you might want to refresh the customer table
    
    // Close the form
    setIsFormOpen(false);
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="rightside">
        <AdminHead/>
        <div className="data">
          <h1 className="heading">
            Dashboard
          </h1>
          <StatsCards />
          
          <div className="table-header">
            <h2 className="table-title">Customer Management</h2>
            <button className="add-entry-btn" onClick={handleAddEntry}>
              <span className="add-icon">+</span> Add New Customer
            </button>
          </div>
          
          <CustomerTable />
          
          {/* Customer Form Modal */}
          <CustomerForm 
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            onSubmit={handleSubmitForm}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard