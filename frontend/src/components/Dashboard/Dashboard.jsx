import React from "react";
import "./Dashboard.css";
import profilePhoto from "../../assets/images/bg.jpg";
import Header from '../Header/Header'

function Dashboard() {
    const userName = "John Doe"; // Sample user name, replace with dynamic data as needed

    return (
        <div className="dashboard-container">
            {/* Sidebar Menu */}
            <div className="sidebar">
                <h3 className="sidebar-title">Menu</h3>
                <ul className="sidebar-menu">
                    <li><a href="#dashboard">Dashboard</a></li>
                    <li><a href="#profile">Profile</a></li>
                    <li><a href="#settings">Settings</a></li>
                    <li><a href="#logout">Logout</a></li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <div className="header">
                    <div className="user-info">
                        <h2 className="user-name">{userName}</h2>
                        <div className="placeholder-links">
                            <a href="#home">Home</a>
                            <a href="#about">About</a>
                            <a href="#contact">Contact</a>
                        </div>
                    </div>
                    <div className="profile-photo">
                        <img src={profilePhoto} alt="Profile" />
                    </div>
                </div>

                {/* Cards Section */}
                <div className="cards-container">
                    <div className="card">
                        <h3>Revenue</h3>
                        <p>$25,000</p>
                        <span className="card-detail">+5% from last month</span>
                    </div>
                    <div className="card">
                        <h3>Users</h3>
                        <p>1,234</p>
                        <span className="card-detail">+12% from last month</span>
                    </div>
                    <div className="card">
                        <h3>Projects</h3>
                        <p>15</p>
                        <span className="card-detail">3 completed this week</span>
                    </div>
                    <div className="card">
                        <h3>Tasks</h3>
                        <p>42</p>
                        <span className="card-detail">8 pending</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;