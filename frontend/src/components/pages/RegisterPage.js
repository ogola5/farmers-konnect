// RegisterPage.js
import React, { useState,useEffect } from 'react';
import { ethers } from 'ethers';
import InvestorFarmerRegistration from '../../contracts/InvestorFarmerRegistration.json';
import contractAddress from '../../contracts/contract-address.json';

// The local node URL; default for Hardhat is 'http://localhost:8545'
const localNodeUrl = 'http://localhost:8545';
const provider = new ethers.providers.JsonRpcProvider(localNodeUrl);

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profile, setProfile] = useState(null);
    const [userType, setUserType] = useState('Investor'); // or 'Farmer'

    // Initialize ethers.js contract instance
    const signer = provider.getSigner();
    const registrationContract = new ethers.Contract(
        contractAddress.InvestorFarmerRegistration,
        InvestorFarmerRegistration.abi,
        signer
    );
    // Get profile details for the connected account
    const fetchProfile = async () => {
        try {
            // Request account access if needed (this will prompt MetaMask to connect)
            const accounts = await provider.send("eth_requestAccounts", []);
            const account = accounts[0]; // Use the connected MetaMask account

            // Call the getProfile function from the contract
            const profileData = await registrationContract.getProfile(account);
            setProfile(profileData);
        } catch (error) {
            console.error(error);
            alert('An error occurred while fetching the profile.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
    
        try {
            // Request account access if needed (this will prompt MetaMask to connect)
            await window.ethereum.request({ method: 'eth_requestAccounts' });
    
            // You now have access to the user's accounts
            const accounts = await provider.listAccounts();
            const account = accounts[0]; // Use the connected MetaMask account
    
            // Reconnect the signer with the MetaMask account
            const signer = provider.getSigner(account);
            const registrationContractWithSigner = registrationContract.connect(signer);
    
            // Assuming the contract has a registerProfile function
            const tx = await registrationContractWithSigner.registerProfile(name, email, userType);
            await tx.wait();
    
            alert('Registration successful!');
        } catch (error) {
            console.error(error);
            alert('An error occurred during registration.');
        }
    };
    // Load the profile on component mount
    useEffect(() => {
        fetchProfile();
    }, []);
    
    

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
            <button onClick={fetchProfile}>Fetch Profile</button>
            {profile && (
                <div>
                    <p>Name: {profile.name}</p>
                    <p>Email: {profile.email}</p>
                    <p>User Type: {profile.userType === 0 ? 'Investor' : 'Farmer'}</p>
                    <p>Status: {profile.isActive ? 'Active' : 'Inactive'}</p>
                </div>
            )}
        </div>
    );
};

export default RegisterPage;
