// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SalesAndRevenueManagement {
    address public owner;
    uint256 public totalRevenue;
    uint256 public totalDistributedToInvestors;
    uint256 public totalPaidToFarmers;

    struct Sale {
        uint256 amount;
        address buyer;
        uint256 date;
        uint256 projectId;
    }

    mapping(uint256 => Sale) public sales;
    uint256 public nextSaleId;

    // Events for tracking contract interactions
    event SaleRecorded(uint256 indexed saleId, uint256 amount, address buyer, uint256 projectId);
    event ProfitsDistributed(uint256 amount);
    event PaymentsMade(uint256 amount);
    event OwnerUpdated(address newOwner);
    event RevenueWithdrawn(address to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Record a new sale transaction
    function recordSale(uint256 projectId, uint256 amount, address buyer) public onlyOwner {
        require(amount > 0, "Sale amount must be greater than zero");
        sales[nextSaleId] = Sale(amount, buyer, block.timestamp, projectId);
        emit SaleRecorded(nextSaleId, amount, buyer, projectId);
        nextSaleId++;
        totalRevenue += amount;
    }

    // Distribute profits to investors
    function distributeProfits(uint256 amount) public onlyOwner {
        require(amount <= totalRevenue, "Insufficient funds for distribution");
        totalDistributedToInvestors += amount;
        totalRevenue -= amount;
        emit ProfitsDistributed(amount);
    }

    // Make payments to farmers
    function makePaymentsToFarmers(uint256 amount) public onlyOwner {
        require(amount <= totalRevenue, "Insufficient funds for payments");
        totalPaidToFarmers += amount;
        totalRevenue -= amount;
        emit PaymentsMade(amount);
    }

    // Retrieve details of a specific sale by its ID
    function getSaleDetails(uint256 saleId) public view returns (Sale memory) {
        require(saleId < nextSaleId, "Sale does not exist");
        return sales[saleId];
    }

    // Update the ownership of the contract
    function updateOwner(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
        emit OwnerUpdated(newOwner);
    }

    // Withdraw accumulated revenue
    function withdrawRevenue(address payable to, uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        to.transfer(amount);
        emit RevenueWithdrawn(to, amount);
    }

    // Check the current balance of the contract
    function checkContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Retrieve total sales for a specific project
    function getTotalSalesForProject(uint256 projectId) public view returns (uint256) {
        uint256 totalSales = 0;
        for (uint256 i = 0; i < nextSaleId; i++) {
            if (sales[i].projectId == projectId) {
                totalSales += sales[i].amount;
            }
        }
        return totalSales;
    }

    // Additional helper functions can be added here as needed
}
