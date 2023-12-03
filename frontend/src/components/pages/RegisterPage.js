// RegisterPage.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import InvestorFarmerRegistration from '../../contracts/InvestorFarmerRegistration.json';
import contractAddress from '../../contracts/contract-address.json';
import '../../escrow.css';


const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');    
    const [userType, setUserType] = useState('Investor'); // or 'Farmer'

    
    const requestAccount = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                return accounts[0];
            } catch (error) {
                throw new Error('No account access granted by user.');
            }
        } else {
            throw new Error('MetaMask is not installed.');
        }
    };
    

    const handleRegister = async (e) => {
        e.preventDefault();
    
        try {
            const account = await requestAccount(); // Request MetaMask account access
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner(account);
            const registrationContract = new ethers.Contract(
                contractAddress.InvestorFarmerRegistration,
                InvestorFarmerRegistration.abi,
                signer
            );
    
            const userTypeEnum = userType === 'Investor' ? 0 : 1; // Map user type to enum value
            const tx = await registrationContract.registerProfile(name, email, userTypeEnum);
            await tx.wait();
    
            alert('Registration successful!');
        }catch (error) {
            console.error(error);
            alert(`An error occurred during registration: ${error.message}`);
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
