// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/interaction/HomePage';
//import AgriculturalProjectManagementPage from './components/pages/AgriculturalProjectManagementPage';
//import AIAnalyticsIntegrationPage from './components/pages/AIAnalyticsIntegrationPage';
import EscrowInteractionPage from './components/pages/EscrowInteraction';
import ExtensionOfficerReportingPage from './components/pages/ExtensionOfficerReportingPage';
import InHouseLoanServicePage from './components/pages/InHouseLoanServicePage';
import SalesAndRevenueManagementPage from './components/pages/SalesAndRevenueManagementPage';
import RegisterPage from './components/pages/RegisterPage';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/agricultural-project-management" element={<AgriculturalProjectManagementPage />} />
          <Route path="/ai-analytics-integration" element={<AIAnalyticsIntegrationPage />} /> */}
          <Route path="/escrow-and-funds-distribution" element={<EscrowInteractionPage />} />
          <Route path="/extension-officer-reporting" element={<ExtensionOfficerReportingPage />} />
          <Route path="/inhouse-loan-service" element={<InHouseLoanServicePage />} />
          <Route path="/sales-and-revenue-management" element={<SalesAndRevenueManagementPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;


