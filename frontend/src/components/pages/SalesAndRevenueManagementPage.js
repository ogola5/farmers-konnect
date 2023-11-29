// SalesAndRevenueManagementPage.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import SalesAndRevenueManagementContract from '../../contracts/SalesAndRevenueManagement.json';
import contractAddress from '../../contracts/contract-address.json';

const localNodeUrl = 'http://localhost:8545';
const provider = new ethers.providers.JsonRpcProvider(localNodeUrl);

const SalesAndRevenueManagementPage = () => {
    const [projectId, setProjectId] = useState('');
    const [saleAmount, setSaleAmount] = useState('');
    const [buyerAddress, setBuyerAddress] = useState('');
    const [distributionAmount, setDistributionAmount] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');

    const signer = provider.getSigner();
    const managementContract = new ethers.Contract(
        contractAddress.SalesAndRevenueManagement,
        SalesAndRevenueManagementContract.abi,
        signer
    );

    const handleRecordSale = async (e) => {
        e.preventDefault();

        try {
            await provider.send("eth_requestAccounts", []);
            const tx = await managementContract.recordSale(projectId, ethers.utils.parseEther(saleAmount), buyerAddress);
            await tx.wait();

            alert('Sale recorded successfully!');
        } catch (error) {
            console.error(error);
            alert('An error occurred while recording the sale.');
        }
    };

    const handleDistributeProfits = async (e) => {
        e.preventDefault();

        try {
            await provider.send("eth_requestAccounts", []);
            const tx = await managementContract.distributeProfits(ethers.utils.parseEther(distributionAmount));
            await tx.wait();

            alert('Profits distributed successfully!');
        } catch (error) {
            console.error(error);
            alert('An error occurred while distributing profits.');
        }
    };

    const handleMakePayments = async (e) => {
        e.preventDefault();

        try {
            await provider.send("eth_requestAccounts", []);
            const tx = await managementContract.makePaymentsToFarmers(ethers.utils.parseEther(paymentAmount));
            await tx.wait();

            alert('Payments made successfully!');
        } catch (error) {
            console.error(error);
            alert('An error occurred while making payments.');
        }
    };

    return (
        <div>
            <h1>Sales and Revenue Management</h1>
            <form onSubmit={handleRecordSale}>
                <input
                    type="text"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="Project ID"
                    required
                />
                <input
                    type="text"
                    value={saleAmount}
                    onChange={(e) => setSaleAmount(e.target.value)}
                    placeholder="Sale Amount (ETH)"
                    required
                />
                <input
                    type="text"
                    value={buyerAddress}
                    onChange={(e) => setBuyerAddress(e.target.value)}
                    placeholder="Buyer Address"
                    required
                />
                <button type="submit">Record Sale</button>
            </form>

            <form onSubmit={handleDistributeProfits}>
                <input
                    type="text"
                    value={distributionAmount}
                    onChange={(e) => setDistributionAmount(e.target.value)}
                    placeholder="Distribution Amount (ETH)"
                    required
                />
                <button type="submit">Distribute Profits</button>
            </form>

            <form onSubmit={handleMakePayments}>
                <input
                    type="text"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Payment Amount (ETH)"
                    required
                />
                <button type="submit">Make Payments</button>
            </form>
        </div>
    );
};

export default SalesAndRevenueManagementPage;

