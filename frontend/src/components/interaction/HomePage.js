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
    { name: 'RegisterPage', path: '/register' },
    // Add other contracts here...
  ];

  const cardStyle = {
    width: '300px',
    padding: '20px',
    margin: '10px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    transition: 'transform 0.2s',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50', // This is a green color
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50px',
  };

  const headerStyle = {
    color: '#333', // Dark grey color for the text
    marginBottom: '30px',
  };

  const handleCardHover = (index) => {
    const card = document.getElementById(`contract-card-${index}`);
    card.style.transform = 'scale(1.05)';
  };

  const handleCardLeave = (index) => {
    const card = document.getElementById(`contract-card-${index}`);
    card.style.transform = 'scale(1)';
  };

  return (
    <div >
    <div style={{display: 'flex', justifyContent : 'center' , alignItems: 'center'}}>
     <h1 style={headerStyle}>Farmers Konnect - Administration</h1>
    </div>

   <div style={containerStyle}>
   {contracts.map((contract, index) => (
        <div
          key={index}
          id={`contract-card-${index}`}
          style={cardStyle}
          onMouseEnter={() => handleCardHover(index)}
          onMouseLeave={() => handleCardLeave(index)}
        >
          <Link to={contract.path} style={{ textDecoration: 'none' }}>
            <button style={buttonStyle}>{contract.name}</button>
          </Link>
        </div>
      ))}
   </div>
  
    </div>
  );
};

export default HomePage;
