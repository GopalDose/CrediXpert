import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './CreditScoreTimeline.css';

const CreditScoreTimeline = ({ 
  timeRanges = ['All Time', '1 Year', '6 Months', '3 Months'],
  defaultTimeRange = 'All Time'
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(defaultTimeRange);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Sample data for the chart
  const data = [
    { month: '2023-01', score: 640 },
    { month: '2023-02', score: 645 },
    { month: '2023-03', score: 652 },
    { month: '2023-04', score: 660 },
    { month: '2023-05', score: 665 },
    { month: '2023-06', score: 672 },
    { month: '2023-07', score: 680 },
    { month: '2023-08', score: 685 },
    { month: '2023-09', score: 695 },
    { month: '2023-10', score: 705 },
    { month: '2023-11', score: 720 },
    { month: '2023-12', score: 738 }
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const selectTimeRange = (range) => {
    setSelectedTimeRange(range);
    setDropdownOpen(false);
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-date">{payload[0].payload.month}</p>
          <p className="tooltip-score">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="credit-timeline-card">
      <div className="timeline-header">
        <h2>Credit Score Timeline</h2>
        <div className="timeline-dropdown">
          <button 
            className="dropdown-toggle" 
            onClick={toggleDropdown}
          >
            {selectedTimeRange} <FiChevronDown size={16} />
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              {timeRanges.map((range) => (
                <div 
                  key={range} 
                  className={`dropdown-item ${range === selectedTimeRange ? 'active' : ''}`}
                  onClick={() => selectTimeRange(range)}
                >
                  {range}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="timeline-chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              }}
            />
            <YAxis 
              domain={['dataMin - 20', 'dataMax + 10']} 
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#3182ce" 
              strokeWidth={2}
              dot={{ stroke: '#3182ce', strokeWidth: 2, r: 4, fill: 'white' }}
              activeDot={{ stroke: '#3182ce', strokeWidth: 2, r: 6, fill: '#3182ce' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CreditScoreTimeline;