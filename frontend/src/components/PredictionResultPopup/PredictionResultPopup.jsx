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
    const loanAmount = result.Predicted_Loan || 0;
    const requestedAmount = result.Requested_Loan_Amount || 0;
    const approvalPercentage = requestedAmount > 0
        ? Math.round((loanAmount / requestedAmount) * 100)
        : 0;

    // Function to generate and download HTML report
    const handleDownloadReport = () => {
        // Create a new HTML document for the report
        const reportWindow = window.open('', '_blank');
        
        // Get current date for the report
        const currentDate = new Date().toLocaleDateString();
        
        // Apply styling
        const style = `
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 20px;
                }
                .section {
                    margin-bottom: 30px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #f2f2f2;
                }
                .risk-low {
                    color: #4ade80;
                    font-weight: bold;
                }
                .risk-medium {
                    color: #facc15;
                    font-weight: bold;
                }
                .risk-high {
                    color: #f87171;
                    font-weight: bold;
                }
                .footer {
                    margin-top: 50px;
                    text-align: center;
                    font-size: 0.8em;
                    color: #888;
                    border-top: 1px solid #ddd;
                    padding-top: 20px;
                }
                .print-button {
                    display: block;
                    margin: 20px auto;
                    padding: 10px 20px;
                    background-color: #4b5563;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                @media print {
                    .print-button {
                        display: none;
                    }
                }
            </style>
        `;
        
        // Get risk class
        let riskClass = '';
        if (result.Risk_Category.includes('Low')) {
            riskClass = 'risk-low';
        } else if (result.Risk_Category.includes('Medium')) {
            riskClass = 'risk-medium';
        } else if (result.Risk_Category.includes('High')) {
            riskClass = 'risk-high';
        }
        
        // Create insights HTML
        let insightsHTML = '';
        if (metadata && metadata.length > 0) {
            insightsHTML = `
                <ul style="padding-left: 20px;">
                    ${metadata.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        } else {
            insightsHTML = `<p>No specific insights available for this assessment.</p>`;
        }

        // Create HTML content for the report
        const reportContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Loan Assessment Report</title>
                ${style}
            </head>
            <body>
                <button class="print-button" onclick="window.print()">Print Report</button>
                
                <div class="header">
                    <h1>Loan Assessment Report</h1>
                    <p>Date: ${currentDate}</p>
                    <p>Business ID: ${result.Business_ID || 'N/A'}</p>
                </div>
                
                <div class="section">
                    <h2>Credit Score Assessment</h2>
                    <table>
                        <tr>
                            <th>Credit Score</th>
                            <td>${result.Credit_Score}/900</td>
                        </tr>
                        <tr>
                            <th>Rating</th>
                            <td>${scoreInfo.label}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="section">
                    <h2>Risk Assessment</h2>
                    <table>
                        <tr>
                            <th>Risk Category</th>
                            <td class="${riskClass}">${result.Risk_Category}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="section">
                    <h2>Loan Details</h2>
                    <table>
                        <tr>
                            <th>Approved Loan Amount</th>
                            <td>${formatCurrency(loanAmount)}</td>
                        </tr>
                        <tr>
                            <th>Requested Loan Amount</th>
                            <td>${formatCurrency(requestedAmount)}</td>
                        </tr>
                        <tr>
                            <th>Approval Percentage</th>
                            <td>${approvalPercentage}%</td>
                        </tr>
                    </table>
                </div>
                
                <div class="section">
                    <h2>Business Metrics</h2>
                    <table>
                        <tr>
                            <th>Annual Revenue</th>
                            <td>${formatCurrency(result.Annual_Revenue || 0)}</td>
                        </tr>
                        <tr>
                            <th>GST Compliance</th>
                            <td>${result.GST_Compliance || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Past Defaults</th>
                            <td>${result.Past_Defaults || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Bank Transactions</th>
                            <td>${result.Bank_Transactions || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Market Trend</th>
                            <td>${result.Market_Trend || 'N/A'}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="section">
                    <h2>Risk Insights</h2>
                    ${insightsHTML}
                </div>
                
                <div class="footer">
                    <p>This report is generated automatically and is strictly confidential.</p>
                    <p>For any queries, please contact the finance department.</p>
                </div>
            </body>
            </html>
        `;
        
        // Write the HTML content to the new window
        reportWindow.document.open();
        reportWindow.document.write(reportContent);
        reportWindow.document.close();
    };

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
                    <button className="secondary-button" onClick={handleDownloadReport}>Download Report</button>
                </div>
            </div>
        </div>
    );
};

export default PredictionResultPopup;