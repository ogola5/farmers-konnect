// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EscrowAndFundsDistribution {
    address owner;
    mapping(address => uint256) public deposits;
    
    // Modifier to restrict functions to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Deposit funds into the contract
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero.");
        deposits[msg.sender] += msg.value;
    }

    // Disburse funds to a specified address
    function disburse(address payable recipient, uint256 amount) public onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance in contract.");
        require(deposits[recipient] >= amount, "Insufficient deposit to disburse.");
        deposits[recipient] -= amount;
        recipient.transfer(amount);
    }

    // Return funds to the investor
    function returnFunds(address payable investor) public onlyOwner {
        uint256 amount = deposits[investor];
        require(amount > 0, "No funds to return.");
        deposits[investor] = 0;
        investor.transfer(amount);
    }

    // View contract balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
