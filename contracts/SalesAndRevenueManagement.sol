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

    event SaleRecorded(uint256 indexed saleId, uint256 amount, address buyer, uint256 projectId);
    event ProfitsDistributed(uint256 amount);
    event PaymentsMade(uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function recordSale(uint256 projectId, uint256 amount, address buyer) public onlyOwner {
        require(amount > 0, "Sale amount must be greater than zero");

        sales[nextSaleId] = Sale({
            amount: amount,
            buyer: buyer,
            date: block.timestamp,
            projectId: projectId
        });

        emit SaleRecorded(nextSaleId, amount, buyer, projectId);
        nextSaleId++;
        totalRevenue += amount;
    }

    function distributeProfits(uint256 amount) public onlyOwner {
        require(amount <= totalRevenue, "Insufficient funds for distribution");
        // Logic for distributing profits to investors
        // Update state variables accordingly
        totalDistributedToInvestors += amount;
        totalRevenue -= amount;

        emit ProfitsDistributed(amount);
    }

    function makePaymentsToFarmers(uint256 amount) public onlyOwner {
        require(amount <= totalRevenue, "Insufficient funds for payments");
        // Logic for making payments to farmers
        // Update state variables accordingly
        totalPaidToFarmers += amount;
        totalRevenue -= amount;

        emit PaymentsMade(amount);
    }

    // A function to retrieve the details of a specific sale by its ID. This would be useful for external queries:
    function getSaleDetails(uint256 saleId) public view returns (Sale memory) {
        require(saleId < nextSaleId, "Sale does not exist");
        return sales[saleId];
    }
    // In case the ownership needs to be transferred or updated:
    function updateOwner(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
    // To withdraw accumulated revenue to a specific address (likely the platform's operational fund):
    function withdrawRevenue(address payable to, uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        to.transfer(amount);
    }

    // Functions to check the current balance of the contract, total revenue, and distributed amounts:
    function checkContractBalance() public view returns (uint256) {
    return address(this).balance;
}

    function getTotalRevenue() public view returns (uint256) {
        return totalRevenue;
    }

    function getTotalDistributedToInvestors() public view returns (uint256) {
        return totalDistributedToInvestors;
    }

    function getTotalPaidToFarmers() public view returns (uint256) {
        return totalPaidToFarmers;
    }
    // Functions that provide reports or analytics, like total sales per project, average sale value,
    function getTotalSalesForProject(uint256 projectId) public view returns (uint256) {
        uint256 totalSales = 0;
        for (uint256 i = 0; i < nextSaleId; i++) {
            if (sales[i].projectId == projectId) {
                totalSales += sales[i].amount;
            }
        }
        return totalSales;
    }

}
