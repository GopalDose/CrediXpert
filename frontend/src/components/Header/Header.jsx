import React from 'react'
import './Header.css'
import { FaChartLine } from "react-icons/fa6";

const Header = () => {
    return (
        <header className="header">
            <div className="brand">
                <FaChartLine />
                <a href="/">CreditAI</a>
            </div>
            <div className="nav-links">
                <a href="#">Features</a>
                <a href="#">Contact</a>
            </div>
            <div className="button">
                <a href="" className='btn-dark'>Get Started</a>
            </div>
        </header>
    )
}

export default Header