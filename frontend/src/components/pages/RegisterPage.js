// RegisterPage.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import InvestorFarmerRegistration from '../../contracts/InvestorFarmerRegistration.json';
import contractAddress from '../../contracts/contract-address.json';

// The local node URL; default for Hardhat is 'http://localhost:8545'
const localNodeUrl = 'http://localhost:8545';
const provider = new ethers.providers.JsonRpcProvider(localNodeUrl);

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState('Investor'); // or 'Farmer'

    // Initialize ethers.js contract instance
    const signer = provider.getSigner();
    const registrationContract = new ethers.Contract(
        contractAddress.InvestorFarmerRegistration,
        InvestorFarmerRegistration.abi,
        signer
    );

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            // Connect to Metamask or another wallet
            await provider.send("eth_requestAccounts", []);

            // Assuming the contract has a registerProfile function
            const tx = await registrationContract.registerProfile(name, email, userType);
            await tx.wait();

            alert('Registration successful!');
        } catch (error) {
            console.error(error);
            alert('An error occurred during registration.');
        }
    };

    return (
        <div>
            <h1>Register as {userType}</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                    <option value="Investor">Investor</option>
                    <option value="Farmer">Farmer</option>
                </select>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
