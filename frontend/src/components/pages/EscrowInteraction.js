import React, { useState } from 'react';
import { ethers } from 'ethers';

const EscrowInteraction = ({ contractAddress, contractABI }) => {
  // State for storing user inputs
  const [depositAmount, setDepositAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [disburseAmount, setDisburseAmount] = useState('');
  const [investorAddress, setInvestorAddress] = useState('');

  // Function to handle depositing Ether into the escrow
  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount) return;

    try {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const transaction = await contract.deposit({ value: ethers.utils.parseEther(depositAmount) });
      await transaction.wait();
      alert('Deposit successful!');
      setDepositAmount('');
    } catch (error) {
      console.error(error);
      alert('There was an error processing your deposit.');
    }
  };

  // Function to handle disbursing Ether to a recipient from the escrow
  const handleDisburse = async (e) => {
    e.preventDefault();
    if (!recipientAddress || !disburseAmount) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const transaction = await contract.disburse(recipientAddress, ethers.utils.parseEther(disburseAmount));
      await transaction.wait();
      alert('Disbursement successful!');
      setRecipientAddress('');
      setDisburseAmount('');
    } catch (error) {
      console.error(error);
      alert('There was an error processing the disbursement.');
    }
  };

  // Function to handle returning funds to an investor from the escrow
  const handleReturnFunds = async (e) => {
    e.preventDefault();
    if (!investorAddress) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const transaction = await contract.returnFunds(investorAddress);
      await transaction.wait();
      alert('Funds returned successfully!');
      setInvestorAddress('');
    } catch (error) {
      console.error(error);
      alert('There was an error returning the funds.');
    }
  };

  return (
    <div>
      <h1>Escrow Interaction</h1>
      <form onSubmit={handleDeposit}>
        <label>
          Deposit Amount (ETH):
          <input
            type="text"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
        </label>
        <button type="submit">Deposit</button>
      </form>

      <form onSubmit={handleDisburse}>
        <label>
          Recipient Address:
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
        </label>
        <label>
          Disburse Amount (ETH):
          <input
            type="text"
            value={disburseAmount}
            onChange={(e) => setDisburseAmount(e.target.value)}
          />
        </label>
        <button type="submit">Disburse</button>
      </form>

      <form onSubmit={handleReturnFunds}>
        <label>
          Investor Address:
          <input
            type="text"
            value={investorAddress}
            onChange={(e) => setInvestorAddress(e.target.value)}
          />
        </label>
        <button type="submit">Return Funds</button>
      </form>
    </div>
  );
};

export default EscrowInteraction;
