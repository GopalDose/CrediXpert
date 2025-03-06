import React from 'react'
import './AdminDashboard.css'
import Sidebar from '../Sidebar/Sidebar'
import AdminHead from '../AdminHead/AdminHead'
import StatsCards from '../StatsCards/StatsCards'
import CustomerTable from '../CustomerTable/CustomerTable'

const AdminDashboard = () => {
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
        <CustomerTable />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard