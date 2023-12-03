import React, { useState } from 'react';
import { ethers } from 'ethers';
import ExtensionOfficerReportingContract from '../../contracts/ExtensionOfficerReporting.json';
import contractAddress from '../../contracts/contract-address.json';

const ExtensionOfficerReportingPage = () => {
   const [projectId, setProjectId] = useState('');
   const [reportContent, setReportContent] = useState('');
   const [alertMessage, setAlertMessage] = useState('');

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

   const handleSubmitReport = async (e) => {
       e.preventDefault();

       try {
           const account = await requestAccount(); // Request MetaMask account access
           const provider = new ethers.providers.Web3Provider(window.ethereum);
           const signer = provider.getSigner(account);
           const reportingContract = new ethers.Contract(
               contractAddress.ExtensionOfficerReporting,
               ExtensionOfficerReportingContract.abi,
               signer
           );
           //Get the current nonce for the account
           const nonce = await signer.getTransactionCount();
            //Get the transaction
           const tx = {
               to: reportingContract.address,
               data: reportingContract.interface.encodeFunctionData('submitReport', [projectId, reportContent]),
               nonce: nonce,
           };
            

           const signedTx = await signer.signTransaction(tx);
           const txResponse= await provider.sendTransaction(signedTx);
           await txResponse.wait();

           alert('Report submitted successfully');
       } catch (error) {
           console.error(error);
           alert('An error occurred while submitting the report.');
       }
   };

   const handleBroadcastAlert = async (e) => {
       e.preventDefault();

       try {
           const account = await requestAccount(); // Request MetaMask account access
           const provider = new ethers.providers.Web3Provider(window.ethereum);
           const signer = provider.getSigner(account);
           const reportingContract = new ethers.Contract(
               contractAddress.ExtensionOfficerReporting,
               ExtensionOfficerReportingContract.abi,
               signer
           );
            //Get the current nonce for the account
            const nonce = await signer.getTransactionCount();

            //Get the transaction
            const tx ={
                to:reportingContract.address,
                data:reportingContract.interface.encodeFunctionData('broadcastAlert',[projectId,alertMessage]),
                nonce:nonce,

                

            };
            //Sign and send the transaction
            const signedTx = await signer.sendTransaction(tx);
            const txResponse  = await provider.sendTransaction(signedTx);
            await txResponse.wait();
           

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
