// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InHouseLoanService {
    // Struct to store loan details
    struct Loan {
        uint256 amount;
        uint256 interestRate;  // Annual interest rate in percentage
        uint256 duration;      // Loan duration in days
        uint256 start;         // Loan start timestamp
        uint256 dueDate;       // Due date for repayment
        bool isApproved;       // Whether the loan is approved
        bool isDisbursed;      // Whether the loan has been disbursed
        bool isRepaid;         // Whether the loan is repaid
    }

    mapping(address => Loan) public loans; // Mapping of borrower addresses to their loans
    address public owner;
    uint256 public totalLoansDisbursed;

    event LoanApplied(address borrower, uint256 amount);
    event LoanApproved(address borrower);
    event LoanDisbursed(address borrower, uint256 amount);
    event LoanRepaid(address borrower, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action.");
        _;
    }

    modifier onlyBorrower(address _borrower) {
        require(msg.sender == _borrower, "Unauthorized: Only borrower allowed");
        _;
    }

    // Borrowers can apply for a loan
    function applyForLoan(uint256 _amount, uint256 _interestRate, uint256 _duration) public {
        require(loans[msg.sender].amount == 0, "Existing loan must be repaid first");
        loans[msg.sender] = Loan(_amount, _interestRate, _duration, 0, 0, false, false, false);
        emit LoanApplied(msg.sender, _amount);
    }

    // Owner can approve a loan
    function approveLoan(address _borrower) public onlyOwner {
        require(loans[_borrower].amount > 0 && !loans[_borrower].isApproved, "Invalid loan application");
        loans[_borrower].isApproved = true;
        emit LoanApproved(_borrower);
    }

    // Owner can disburse a loan
    function disburseLoan(address _borrower) public onlyOwner {
        require(loans[_borrower].isApproved && !loans[_borrower].isDisbursed, "Loan must be approved and not yet disbursed");
        loans[_borrower].isDisbursed = true;
        loans[_borrower].start = block.timestamp;
        loans[_borrower].dueDate = block.timestamp + (loans[_borrower].duration * 1 days);
        totalLoansDisbursed += loans[_borrower].amount;
        emit LoanDisbursed(_borrower, loans[_borrower].amount);
        // TODO: Implement fund transfer logic
    }

    // Borrowers can repay their loan
    function repayLoan() public payable onlyBorrower(msg.sender) {
        Loan storage loan = loans[msg.sender];
        require(loan.isDisbursed && !loan.isRepaid, "Loan must be disbursed and not yet repaid");
        require(block.timestamp <= loan.dueDate, "Loan repayment is overdue");
        uint256 daysElapsed = (block.timestamp - loan.start) / 60 / 60 / 24;
        uint256 interest = (loan.amount * loan.interestRate * daysElapsed) / 36500;
        uint256 totalDue = loan.amount + interest;
        require(msg.value >= totalDue, "Insufficient amount to repay the loan");
        loan.isRepaid = true;
        uint256 excessAmount = msg.value - totalDue;
        if(excessAmount > 0) {
            payable(msg.sender).transfer(excessAmount);
        }
        payable(owner).transfer(totalDue - loan.amount);
        emit LoanRepaid(msg.sender, loan.amount);
    }

    // Check the current status of a loan
    function checkLoanStatus(address _borrower) public view returns (string memory) {
        Loan memory loan = loans[_borrower];
        if (loan.isRepaid) return "Repaid";
        if (loan.isDisbursed) return "Disbursed";
        if (loan.isApproved) return "Approved";
        return "Applied or Non-existent";
    }

    // Additional function to get detailed loan information
    function getLoanInfo(address _borrower) public view returns (Loan memory) {
        return loans[_borrower];
    }
}
