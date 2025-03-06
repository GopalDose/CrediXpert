import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Home from './Pages/Home';
import Registration from './components/Registration/Registration';
import Dashboard from './components/Dashboard/Dashboard'
import Footer from './components/Footer/Footer';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';

const App = () => {
  return (
    <>
    <Header/>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/admin-dashboard' element={<AdminDashboard/>} />
      </Routes>
    </Router>
    <Footer/>
    </>
  );
};

export default App;
