import React from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
    const adminName = "Admin User"; // Sample admin name, replace with dynamic data

    // Sample user data (without email and password)
    const users = [
        {
            tan: "ABC1234567",
            companyName: "TechCorp",
            founderName: "Jane Doe",
            industry: "Technology",
            foundingYear: "2020",
        },
        {
            tan: "XYZ9876543",
            companyName: "Health Innovations",
            founderName: "John Smith",
            industry: "Healthcare",
            foundingYear: "2018",
        },
        {
            tan: "DEF4567890",
            companyName: "FinancePro",
            founderName: "Alice Brown",
            industry: "Finance",
            foundingYear: "2021",
        },
    ];

    return (
        <div className="admin-dashboard-container">
            {/* Sidebar Menu */}
            <div className="sidebar">
                <h3 className="sidebar-title">Admin Menu</h3>
                <ul className="sidebar-menu">
                    <li><a href="#dashboard">Dashboard</a></li>
                    <li><a href="#users">Manage Users</a></li>
                    <li><a href="#reports">Reports</a></li>
                    <li><a href="#logout">Logout</a></li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <div className="header">
                    <div className="user-info">
                        <h2 className="user-name">{adminName}</h2>
                        <div className="placeholder-links">
                            <a href="#home">Home</a>
                            <a href="#users">Users</a>
                            <a href="#settings">Settings</a>
                        </div>
                    </div>
                    {/* Profile photo removed */}
                </div>

                {/* Users Table */}
                <div className="users-table-container">
                    <h3 className="table-title">Registered Startups</h3>
                    <div className="table-wrapper">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>TAN</th>
                                    <th>Company Name</th>
                                    <th>Founder Name</th>
                                    <th>Industry</th>
                                    <th>Founding Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.tan}</td>
                                        <td>{user.companyName}</td>
                                        <td>{user.founderName}</td>
                                        <td>{user.industry}</td>
                                        <td>{user.foundingYear}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;