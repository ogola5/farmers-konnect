import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const contracts = [
    { name: 'Agricultural Project Management', path: '/agricultural-project-management' },
    { name: 'AI Analytics Integration', path: '/ai-analytics-integration' },
    { name: 'Escrow and Funds Distribution', path: '/escrow-and-funds-distribution' },
    { name: 'Extension Officer Reporting', path: '/extension-officer-reporting' },
    { name: 'In House Loan Service', path: '/inhouse-loan-service' },
    { name: 'Sales and Revenue Management', path: '/sales-and-revenue-management' },
    {name: 'RegisterPage',path: '/register'},
    // Add other contracts here...
  ];

  const buttonStyle = {
    padding: '10px 20px',
    margin: '10px',
    backgroundColor: '#4CAF50', // This is a green color
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '50px',
  };

  const headerStyle = {
    color: '#333', // Dark grey color for the text
    marginBottom: '30px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Farmers Konnect - Contract Interaction</h1>
      {contracts.map((contract, index) => (
        <Link key={index} to={contract.path} style={{ textDecoration: 'none' }}>
          <button style={buttonStyle}>{contract.name}</button>
        </Link>
      ))}
    </div>
  );
};

export default HomePage;

