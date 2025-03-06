import React, { useState, useEffect, useRef } from 'react';
import './CustomerTable.css';

const CustomerTable = () => {
  // Sample customer data based on the provided image
  const initialCustomers = [
    {
      id: 1,
      name: 'Rahul Mehta',
      email: 'rahul@techinnovate.in',
      business: 'TechInnovate Solutions',
      riskLevel: 'Low Risk',
      creditScore: 782,
      limit: 2500000,
    },
    {
      id: 2,
      name: 'Priya Singh',
      email: 'priya@fashionhouse.in',
      business: 'Fashion House India',
      riskLevel: 'Medium Risk',
      creditScore: 675,
      limit: 1500000,
    },
    {
      id: 3,
      name: 'Vikram Patel',
      email: 'vikram@greenfoods.in',
      business: 'Green Foods Organic',
      riskLevel: 'Low Risk',
      creditScore: 802,
      limit: 3000000,
    },
    {
      id: 4,
      name: 'Ananya Sharma',
      email: 'ananya@creativeminds.in',
      business: 'Creative Minds Studio',
      riskLevel: 'Medium Risk',
      creditScore: 620,
      limit: 1000000,
    },
    {
      id: 5,
      name: 'Raj Malhotra',
      email: 'raj@cloudhotels.in',
      business: 'Cloud Hotels & Resorts',
      riskLevel: 'High Risk',
      creditScore: 530,
      limit: 4000000,
    },
  ];

  const [customers, setCustomers] = useState(initialCustomers);
  const [filters, setFilters] = useState({
    name: '',
    business: '',
    riskLevel: '',
    creditScore: '',
    limit: '',
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Apply filters whenever the filters state changes
  useEffect(() => {
    let filteredData = [...initialCustomers];

    // Apply each filter
    if (filters.name) {
      filteredData = filteredData.filter(customer => 
        customer.name.toLowerCase().includes(filters.name.toLowerCase()) ||
        customer.email.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.business) {
      filteredData = filteredData.filter(customer => 
        customer.business.toLowerCase().includes(filters.business.toLowerCase())
      );
    }

    if (filters.riskLevel) {
      filteredData = filteredData.filter(customer => 
        customer.riskLevel.toLowerCase().includes(filters.riskLevel.toLowerCase())
      );
    }

    if (filters.creditScore) {
      filteredData = filteredData.filter(customer => 
        customer.creditScore.toString().includes(filters.creditScore)
      );
    }

    if (filters.limit) {
      filteredData = filteredData.filter(customer => 
        customer.limit.toString().includes(filters.limit)
      );
    }

    setCustomers(filteredData);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (e, column) => {
    setFilters({
      ...filters,
      [column]: e.target.value,
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle dropdown toggle
  const toggleDropdown = (customerId) => {
    setActiveDropdown(activeDropdown === customerId ? null : customerId);
  };

  // Handle view action
  const handleView = (customer) => {
    console.log('Viewing customer:', customer);
    alert(`Viewing details for ${customer.name}`);
    setActiveDropdown(null);
  };

  // Handle delete action
  const handleDelete = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      const updatedCustomers = initialCustomers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
      // You would typically make an API call here
      console.log('Customer deleted:', customerId);
    }
    setActiveDropdown(null);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get risk level badge class
  const getRiskBadgeClass = (risk) => {
    switch (risk) {
      case 'Low Risk':
        return 'risk-badge low-risk';
      case 'Medium Risk':
        return 'risk-badge medium-risk';
      case 'High Risk':
        return 'risk-badge high-risk';
      default:
        return 'risk-badge';
    }
  };

  return (
    <div className="customer-table-container">
      <table className="customer-table">
        <thead>
          <tr>
            <th>
              <div className="th-content">
                <span>Name</span>
                <input
                  type="text"
                  placeholder="Filter name..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange(e, 'name')}
                  className="filter-input"
                />
              </div>
            </th>
            <th>
              <div className="th-content">
                <span>Business</span>
                <input
                  type="text"
                  placeholder="Filter business..."
                  value={filters.business}
                  onChange={(e) => handleFilterChange(e, 'business')}
                  className="filter-input"
                />
              </div>
            </th>
            <th>
              <div className="th-content">
                <span>Risk Level</span>
                <select
                  value={filters.riskLevel}
                  onChange={(e) => handleFilterChange(e, 'riskLevel')}
                  className="filter-select"
                >
                  <option value="">All</option>
                  <option value="Low Risk">Low Risk</option>
                  <option value="Medium Risk">Medium Risk</option>
                  <option value="High Risk">High Risk</option>
                </select>
              </div>
            </th>
            <th>
              <div className="th-content">
                <span>Credit Score</span>
                <input
                  type="text"
                  placeholder="Filter score..."
                  value={filters.creditScore}
                  onChange={(e) => handleFilterChange(e, 'creditScore')}
                  className="filter-input"
                />
              </div>
            </th>
            <th>
              <div className="th-content">
                <span>Limit</span>
                <input
                  type="text"
                  placeholder="Filter limit..."
                  value={filters.limit}
                  onChange={(e) => handleFilterChange(e, 'limit')}
                  className="filter-input"
                />
              </div>
            </th>
            <th>
              <div className="th-content">
                <span>Actions</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>
                <div className="customer-name">
                  <div>{customer.name}</div>
                  <div className="customer-email">{customer.email}</div>
                </div>
              </td>
              <td>{customer.business}</td>
              <td>
                <span className={getRiskBadgeClass(customer.riskLevel)}>
                  {customer.riskLevel === 'Low Risk' && <span className="icon">✓</span>}
                  {customer.riskLevel === 'Medium Risk' && <span className="icon">⚠</span>}
                  {customer.riskLevel === 'High Risk' && <span className="icon">⚫</span>}
                  {customer.riskLevel}
                </span>
              </td>
              <td>
                <div className={`credit-score ${customer.creditScore < 600 ? 'low-score' : 
                  customer.creditScore < 750 ? 'medium-score' : 'high-score'}`}>
                  {customer.creditScore}
                  <span className="total-score">/900</span>
                </div>
              </td>
              <td>{formatCurrency(customer.limit)}</td>
              <td className="actions-cell">
                <div className="dropdown-container" ref={dropdownRef}>
                  <button 
                    className="action-button" 
                    onClick={() => toggleDropdown(customer.id)}
                  >
                    ⋯
                  </button>
                  {activeDropdown === customer.id && (
                    <div className="dropdown-menu">
                      <button 
                        className="dropdown-item"
                        onClick={() => handleView(customer)}
                      >
                        <span className="dropdown-icon">👁️</span> View
                      </button>
                      <button 
                        className="dropdown-item delete"
                        onClick={() => handleDelete(customer.id)}
                      >
                        <span className="dropdown-icon">🗑️</span> Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;