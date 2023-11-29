// ExtensionOfficerReportingPage.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import ExtensionOfficerReportingContract from '../../contracts/ExtensionOfficerReporting.json';
import contractAddress from '../../contracts/contract-address.json';

// The local node URL; default for Hardhat is 'http://localhost:8545'
const localNodeUrl = 'http://localhost:8545';
const provider = new ethers.providers.JsonRpcProvider(localNodeUrl);

const ExtensionOfficerReportingPage = () => {
    const [projectId, setProjectId] = useState('');
    const [reportContent, setReportContent] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    // Initialize ethers.js contract instance
    const signer = provider.getSigner();
    const reportingContract = new ethers.Contract(
        contractAddress.ExtensionOfficerReporting,
        ExtensionOfficerReportingContract.abi,
        signer
    );

    const handleSubmitReport = async (e) => {
        e.preventDefault();

        try {
            // Connect to Metamask or another wallet
            await provider.send("eth_requestAccounts", []);

            // Assuming the contract has a submitReport function
            const tx = await reportingContract.submitReport(projectId, reportContent);
            await tx.wait();

            alert('Report submitted successfully!');
        } catch (error) {
            console.error(error);
            alert('An error occurred while submitting the report.');
        }
    };

    const handleBroadcastAlert = async (e) => {
        e.preventDefault();

        try {
            // Connect to Metamask or another wallet
            await provider.send("eth_requestAccounts", []);

            // Assuming the contract has a broadcastAlert function
            const tx = await reportingContract.broadcastAlert(projectId, alertMessage);
            await tx.wait();

            alert('Alert broadcasted successfully!');
        } catch (error) {
            console.error(error);
            alert('An error occurred while broadcasting the alert.');
        }
    };

    return (
        <div>
            <h1>Extension Officer Reporting</h1>
            <form onSubmit={handleSubmitReport}>
                <input
                    type="text"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="Project ID"
                    required
                />
                <textarea
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    placeholder="Report Content"
                    required
                />
                <button type="submit">Submit Report</button>
            </form>

            <form onSubmit={handleBroadcastAlert}>
                <input
                    type="text"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="Project ID"
                    required
                />
                <textarea
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                    placeholder="Alert Message"
                    required
                />
                <button type="submit">Broadcast Alert</button>
            </form>
        </div>
    );
};

export default ExtensionOfficerReportingPage;
