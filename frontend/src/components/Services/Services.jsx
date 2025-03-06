import React from 'react'
import './Services.css'
import { LuBrain } from "react-icons/lu";
import { RiSecurePaymentLine } from "react-icons/ri";

const Services = () => {
  return (
    <div className="services">
      <span className="head">
        Our Services
      </span>
      <h1 className="heading">
        Services
      </h1>
      <p>
      Our innovative platform uses artificial intelligence and machine learning to provide comprehensive credit Score for businesses of all sizes.
      </p>
      <div className="card-container">
        <div className="card">
          <LuBrain className='icon' />
          <div className="card-title">
            AI-Driven Analysis
          </div>
          <div className="desc">
            Advanced machine learning algorithms for comprehensive credit assessment
          </div>
        </div>
        <div className="card">
          <RiSecurePaymentLine className='icon' />
          <div className="card-title">
          Secure & Reliable
          </div>
          <div className="desc">
          Bank-grade security with encrypted data processing
          </div>
        </div>
        <div className="card">
          <LuBrain className='icon' />
          <div className="card-title">
          Business-Focused
          </div>
          <div className="desc">
          Tailored for MSMEs, startups, and emerging enterprises
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services