import React, { useState } from 'react';
import { ethers } from 'ethers';
import InHouseLoanServiceContract from '../../contracts/InHouseLoanService.json';
import contractAddress from '../../contracts/contract-address.json';
import '../../escrow.css';


const InHouseLoanServicePage = () => {
    const [loanAmount, setLoanAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [loanDuration, setLoanDuration] = useState('');
    const [borrowerAddress, setBorrowerAddress] = useState('');

    // Function to get the signer from MetaMask
    const getSigner = async () => {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        return provider.getSigner();
    };
    const handleApplyForLoan = async (e) => {
        e.preventDefault();

        try {
            const signer = await getSigner();
            const loanServiceContract = new ethers.Contract(
                contractAddress.InHouseLoanService,
                InHouseLoanServiceContract.abi,
                signer
            );
            const tx = await loanServiceContract.applyForLoan(
                ethers.utils.parseEther(loanAmount),
                parseInt(interestRate),
                parseInt(loanDuration)
            );
            await tx.wait();

            alert('Loan application submitted successfully!');
        } catch (error) {
            console.error(error);
            alert('An error occurred while applying for the loan.');
        }
    };

    // Handle Approve Loan
    const handleApproveLoan = async (e) => {
        e.preventDefault();

        try {
            const signer = await getSigner();
            const loanServiceContract = new ethers.Contract(
                contractAddress.InHouseLoanService,
                InHouseLoanServiceContract.abi,
                signer
            );
            const tx = await loanServiceContract.approveLoan(borrowerAddress);
            await tx.wait();

            alert('Loan approved successfully!');
        } catch (error) {
            console.error(error);
            alert('An error occurred while approving the loan.');
        }
    };

    // Handle Disburse Loan
    const handleDisburseLoan = async (e) => {
        e.preventDefault();

        try {
            const signer = await getSigner();
            const loanServiceContract = new ethers.Contract(
                contractAddress.InHouseLoanService,
                InHouseLoanServiceContract.abi,
                signer
            );
            const tx = await loanServiceContract.disburseLoan(borrowerAddress);
            await tx.wait();

            alert('Loan disbursed successfully!');
        } catch (error) {
            console.error(error);
            alert('An error occurred while disbursing the loan.');
        }
    };

    // Additional functions for repaying loans and checking loan status can be implemented here

    return (
        <div>
            <h1>In-House Loan Service</h1>
            <form onSubmit={handleApplyForLoan}>
                <input
                    type="text"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="Loan Amount (ETH)"
                    required
                />
                <input
                    type="text"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="Interest Rate (%)"
                    required
                />
                <input
                    type="text"
                    value={loanDuration}
                    onChange={(e) => setLoanDuration(e.target.value)}
                    placeholder="Loan Duration (days)"
                    required
                />
                <button type="submit">Apply for Loan</button>
            </form>

            <form onSubmit={handleApproveLoan}>
                <input
                    type="text"
                    value={borrowerAddress}
                    onChange={(e) => setBorrowerAddress(e.target.value)}
                    placeholder="Borrower Address"
                    required
                />
                <button type="submit">Approve Loan</button>
            </form>

            <form onSubmit={handleDisburseLoan}>
                <input
                    type="text"
                    value={borrowerAddress}
                    onChange={(e) => setBorrowerAddress(e.target.value)}
                    placeholder="Borrower Address for Disbursement"
                    required
                />
                <button type="submit">Disburse Loan</button>
            </form>

            {/* Additional forms and UI elements for repaying loans and checking loan status */}
        </div>
    );
};

export default InHouseLoanServicePage;
