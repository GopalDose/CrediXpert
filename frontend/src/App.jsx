import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Registration from './components/Registration/Registration';
import Footer from './components/Footer/Footer';
import AdminDashboard from './components/Dashboard/AdminDashboard';

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
    <Footer/>
    </>
  );
};

export default App;
