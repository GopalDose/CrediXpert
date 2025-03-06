import React from 'react'
import './Hero.css'
import bg from '../../assets/images/bg.jpg'
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="hero">
      <span className="head">
        Revolutionizing Business Credit Assessment
      </span>
      <h1 className="title">
        AI-Powered Credit Scoring for Macro Finance Businesses
      </h1>
      <div className="button">
        <Link to='/register' className='btn-outline'> Get Started</Link>
      </div>
    </div>
  )
}

export default Hero