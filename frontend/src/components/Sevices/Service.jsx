// Service.js
import React from 'react';
import './Services.css';

function Service() {
  return (
    <div className="service-container">
      <header className="service-header">
        <h1 className="service-title">CIBIL Score Mastery</h1>
      </header>

      <section className="cards-container">
        {/* Card 1 */}
        <div className="service-card">
          <h2>Score Monitoring</h2>
          <p>
            Stay ahead with real-time CIBIL score tracking. Get daily updates, 
            detailed trend analysis, and personalized alerts when your score changes. 
            Understand factors affecting your score with our intuitive dashboard.
          </p>
          <a href="#" className="learn-more">Learn More</a>
        </div>

        {/* Card 2 */}
        <div className="service-card">
          <h2>Credit Analysis</h2>
          <p>
            Dive deep into your credit profile with comprehensive analysis. Receive 
            expert recommendations, identify improvement areas, and access tailored 
            strategies to boost your score effectively over time.
          </p>
          <a href="#" className="learn-more">Learn More</a>
        </div>

        {/* Card 3 */}
        <div className="service-card">
          <h2>Dispute Resolution</h2>
          <p>
            Spot and fix credit report errors effortlessly. Our guided dispute 
            process helps you file claims, track progress, and ensure your credit 
            information remains accurate and up-to-date.
          </p>
          <a href="#" className="learn-more">Learn More</a>
        </div>
      </section>

      <section className="additional-info">
        <h2>Why Choose Us?</h2>
        <p>
          We provide a complete solution for managing your CIBIL score. From 
          monitoring to improvement, our platform offers secure, user-friendly 
          tools backed by expert financial advice to help you achieve your goals.
        </p>
      </section>
    </div>
  );
}

export default Service;