// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Escrow and Funds Distribution
 * @dev This contract manages escrow services and funds distribution for various parties.
 *      It allows deposits, disbursements, and returns of funds, with event logging for each action.
 */
contract EscrowAndFundsDistribution {
    address public owner; // The owner of the contract
    mapping(address => uint256) public deposits; // Mapping to keep track of each address's deposits

    // Events to log various actions
    event DepositMade(address indexed depositor, uint256 amount);
    event FundsDisbursed(address indexed recipient, uint256 amount);
    event FundsReturned(address indexed investor, uint256 amount);

    /**
     * @dev Sets the contract's owner to the address that deploys the contract.
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Modifier to allow only the owner to call certain functions.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    /**
     * @dev Allows an address to deposit ether into the contract.
     */
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero.");
        deposits[msg.sender] += msg.value;
        emit DepositMade(msg.sender, msg.value);
    }

    /**
     * @dev Allows the owner to disburse funds from the contract to a specified recipient.
     * @param recipient The address of the recipient.
     * @param amount The amount of ether to disburse.
     */
    function disburse(address payable recipient, uint256 amount) public onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance in contract.");
        require(deposits[recipient] >= amount, "Insufficient deposit to disburse.");
        deposits[recipient] -= amount;
        recipient.transfer(amount);
        emit FundsDisbursed(recipient, amount);
    }

    /**
     * @dev Allows the owner to return deposited funds to an investor.
     * @param investor The address of the investor.
     */
    function returnFunds(address payable investor) public onlyOwner {
        uint256 amount = deposits[investor];
        require(amount > 0, "No funds to return.");
        deposits[investor] = 0;
        investor.transfer(amount);
        emit FundsReturned(investor, amount);
    }

    /**
     * @dev Retrieves the total balance held by the contract.
     * @return The total balance of ether held in the contract.
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
