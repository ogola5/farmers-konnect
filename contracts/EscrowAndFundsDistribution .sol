// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Escrow and Funds Distribution
 * @dev Manages escrow services and funds distribution for various parties.
 */
contract EscrowAndFundsDistribution {
    address public owner;

    mapping(address => uint256) public deposits;

    /**
     * @dev Sets the original `owner` of the contract to the sender account.
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Modifier to restrict functions to the `owner`.
     * @notice Restricts function access to the owner of the contract.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    /**
     * @dev Deposits funds into the contract.
     * @notice Allows a user to deposit funds into the contract.
     */
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero.");
        deposits[msg.sender] += msg.value;
    }

    /**
     * @dev Disburses funds to a specified recipient.
     * @param recipient The address of the recipient to disburse funds to.
     * @param amount The amount of funds to disburse.
     * @notice Only callable by the owner. Ensures contract and recipient have sufficient balance.
     */
    function disburse(address payable recipient, uint256 amount) public onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance in contract.");
        require(deposits[recipient] >= amount, "Insufficient deposit to disburse.");
        deposits[recipient] -= amount;
        recipient.transfer(amount);
    }

    /**
     * @dev Returns funds to the investor.
     * @param investor The address of the investor to return funds to.
     * @notice Only callable by the owner. Ensures the investor has funds to return.
     */
    function returnFunds(address payable investor) public onlyOwner {
        uint256 amount = deposits[investor];
        require(amount > 0, "No funds to return.");
        deposits[investor] = 0;
        investor.transfer(amount);
    }

    /**
     * @dev Retrieves the total balance held by the contract.
     * @return The total balance held in the contract.
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Additional functions as required
}
