import React from 'react';
import './PredictionResultPopup.css';

const PredictionResultPopup = ({ isOpen, onClose, result }) => {
    if (!isOpen || !result) return null;

    // Parse metadata if it's a string
    let metadata = result.metadata;
    if (typeof metadata === 'string') {
        try {
            metadata = JSON.parse(metadata);
        } catch (e) {
            console.error('Failed to parse metadata:', e);
            metadata = { reasons: ['Metadata parsing error'] };
        }
    }

    // Format currency with Indian Rupee symbol and commas
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Determine risk color
    const getRiskColor = (riskCategory) => {
        switch (riskCategory) {
            case 'Low Risk':
                return '#4ade80'; // green
            case 'Medium Risk':
                return '#facc15'; // yellow
            case 'High Risk':
                return '#f87171'; // red
            default:
                return '#94a3b8'; // slate
        }
    };

    // Determine credit score color and label
    const getCreditScoreInfo = (score) => {
        let color = '#94a3b8'; // default gray
        let label = 'Unknown';

        if (score >= 750) {
            color = '#4ade80'; // green
            label = 'Excellent';
        } else if (score >= 700) {
            color = '#22d3ee'; // cyan
            label = 'Very Good';
        } else if (score >= 650) {
            color = '#60a5fa'; // blue
            label = 'Good';
        } else if (score >= 600) {
            color = '#facc15'; // yellow
            label = 'Fair';
        } else if (score >= 0) {
            color = '#f87171'; // red
            label = 'Poor';
        }

        return { color, label };
    };

    const scoreInfo = getCreditScoreInfo(result.Credit_Score);
    const riskColor = getRiskColor(result.Risk_Category);
    const loanAmount = result['Predicted Loan'] || 0;
    const requestedAmount = result.Requested_Loan_Amount || 0;
    const approvalPercentage = requestedAmount > 0
        ? Math.round((loanAmount / requestedAmount) * 100)
        : 0;

    return (
        <div className="prediction-overlay">
            <div className="prediction-content">
                <div className="prediction-header">
                    <h2>Loan Assessment Results</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="prediction-body">
                    <div className="prediction-grid">
                        {/* Credit Score Section */}
                        <div className="score-section">
                            <h3>Credit Score</h3>
                            <div className="score-display">
                                <div className="score-circle" style={{
                                    background: `conic-gradient(${scoreInfo.color} ${Math.min(100, result.Credit_Score / 9)}%, #e2e8f0 0)`
                                }}>
                                    <div className="score-value">{result.Credit_Score}</div>
                                </div>
                                <div className="score-info">
                                    <div className="score-label">{result.Credit_Score}<span>/900</span></div>
                                    <div className="score-category" style={{ backgroundColor: scoreInfo.color }}>
                                        {scoreInfo.label}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Risk Assessment Section */}
                        <div className="risk-section">
                            <h3>Risk Assessment</h3>
                            <div className="risk-indicator">
                                <div className="risk-icon" style={{ backgroundColor: riskColor }}>
                                    {result.Risk_Category.includes('Low') ? '✓' : result.Risk_Category.includes('High') ? '!' : '⚠'}
                                </div>
                                <div className="risk-details">
                                    <div className="risk-category" style={{ color: riskColor }}>
                                        {result.Risk_Category}
                                    </div>
                                    <div className="assessment-date">
                                        Assessment Date: {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Loan Details Section */}
                        <div className="loan-section">
                            <h3>Loan Assessment</h3>
                            <div className="loan-amount">
                                <div className="amount-value">{formatCurrency(loanAmount)}</div>
                                <div className="amount-label">{approvalPercentage}% approved</div>
                                <div className="loan-progress">
                                    <div className="progress-bar" style={{ width: `${approvalPercentage}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Risk Insights Section */}
                    <div className="insights-section">
                        <h3>Risk Insights</h3>
                        <div className="points-list">
                            {metadata && metadata.length > 0 ? (
                                <>
                                    {metadata.map((val, index) => (
                                        <p key={index}>{val}</p>
                                    ))}
                                </>

                            ) : (
                                <div className="points-category">
                                    <h4 className="neutral-header">Assessment Notes</h4>
                                    <ul className="points-items">
                                        <li className="point-item neutral">No specific insights available for this assessment.</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="prediction-footer">
                    <button className="primary-button" onClick={onClose}>Close</button>
                    <button className="secondary-button">Download Report</button>
                </div>
            </div>
        </div>
    );
};

export default PredictionResultPopup;