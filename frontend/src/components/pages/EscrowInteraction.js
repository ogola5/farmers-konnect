import React, { useState } from 'react';
import { ethers } from 'ethers';
import EscrowAndFundsDistributionABI from '../../contracts/EscrowAndFundsDistribution.json';
import '../../escrow.css';
const EscrowInteraction = () => {
  const [depositAmount, setDepositAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [disburseAmount, setDisburseAmount] = useState('');
  const [investorAddress, setInvestorAddress] = useState('');

  // Update with the address of your deployed contract on Sepolia
  const contractAddress = '0xBF8C3f3F522C9D73FeD0D12Cf6B8936f738B6969';

  // Connect to MetaMask and create a signer
  const getSigner = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider.getSigner();
  };

  // Handle deposit
  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      const signer = await getSigner();
      const contract = new ethers.Contract(contractAddress, EscrowAndFundsDistributionABI.abi, signer);
      const transaction = await contract.deposit({ value: ethers.utils.parseEther(depositAmount) });
      await transaction.wait();
      alert('Deposit successful!');
      setDepositAmount('');
    } catch (error) {
      console.error(error);
      alert('Error processing deposit.');
    }
  };

  // Handle disbursement
  const handleDisburse = async (e) => {
    e.preventDefault();
    try {
      const signer = await getSigner();
      const contract = new ethers.Contract(contractAddress, EscrowAndFundsDistributionABI.abi, signer);
      const transaction = await contract.disburse(recipientAddress, ethers.utils.parseEther(disburseAmount));
      await transaction.wait();
      alert('Disbursement successful!');
      setRecipientAddress('');
      setDisburseAmount('');
    } catch (error) {
      console.error(error);
      alert('Error processing disbursement.');
    }
  };

  // Handle returning funds
  const handleReturnFunds = async (e) => {
    e.preventDefault();
    try {
      const signer = await getSigner();
      const contract = new ethers.Contract(contractAddress, EscrowAndFundsDistributionABI.abi, signer);
      const transaction = await contract.returnFunds(investorAddress);
      await transaction.wait();
      alert('Funds returned successfully!');
      setInvestorAddress('');
    } catch (error) {
      console.error(error);
      alert('Error returning funds.');
    }
  };

  return (
    <div>
      <h1>Escrow Interaction</h1>
      <form onSubmit={handleDeposit}>
        <input type="text" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="Deposit Amount (ETH)" />
        <button type="submit">Deposit</button>
      </form>

      <form onSubmit={handleDisburse}>
        <input type="text" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} placeholder="Recipient Address" />
        <input type="text" value={disburseAmount} onChange={(e) => setDisburseAmount(e.target.value)} placeholder="Disburse Amount (ETH)" />
        <button type="submit">Disburse</button>
      </form>

      <form onSubmit={handleReturnFunds}>
        <input type="text" value={investorAddress} onChange={(e) => setInvestorAddress(e.target.value)} placeholder="Investor Address" />
        <button type="submit">Return Funds</button>
      </form>
    </div>
  );
};

export default EscrowInteraction;
