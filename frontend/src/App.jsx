import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Home from './Pages/Home';
import Registration from './components/Registration/Registration';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
      </Routes>
    </Router>
  );
};

export default App;
