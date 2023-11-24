pragma solidity ^0.8.0;

contract InHouseLoanService {
    struct Loan {
        uint256 amount;
        uint256 interestRate;  // Annual interest rate
        uint256 duration;     // Loan duration in days
        uint256 start;        // Loan start timestamp
        uint256 dueDate;      // Due date for repayment
        bool isApproved;      // Whether the loan is approved
        bool isDisbursed;     // Whether the loan has been disbursed
        bool isRepaid;        // Whether the loan is repaid
    }

    mapping(address => Loan) public loans;
    address public owner;
    uint256 public totalLoansDisbursed;

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

    function applyForLoan(uint256 _amount, uint256 _interestRate, uint256 _duration) public {
        require(loans[msg.sender].amount == 0, "Existing loan must be repaid first");
        loans[msg.sender] = Loan(_amount, _interestRate, _duration, 0, 0, false, false, false);
    }

    function approveLoan(address _borrower) public onlyOwner {
        require(loans[_borrower].amount > 0 && !loans[_borrower].isApproved, "Invalid loan application");
        loans[_borrower].isApproved = true;
        // Additional risk assessment logic can be added here
    }
    function disburseLoan(address _borrower) public onlyOwner {
        require(loans[_borrower].isApproved && !loans[_borrower].isDisbursed, "Loan must be approved and not yet disbursed");
        loans[_borrower].isDisbursed = true;
        loans[_borrower].start = block.timestamp;
        loans[_borrower].dueDate = block.timestamp + (loans[_borrower].duration * 1 days);
        totalLoansDisbursed += loans[_borrower].amount;
        // Transfer funds to borrower
    }

    function repayLoan() public payable onlyBorrower(msg.sender) {
        Loan storage loan = loans[msg.sender];

        require(loan.isDisbursed && !loan.isRepaid, "Loan must be disbursed and not yet repaid");
        require(block.timestamp <= loan.dueDate, "Loan repayment is overdue");

        // Calculate the total amount due, including interest
        uint256 daysElapsed = (block.timestamp - loan.start) / 60 / 60 / 24;
        uint256 interest = (loan.amount * loan.interestRate * daysElapsed) / 36500; // Assuming interestRate is annual and in percentage
        uint256 totalDue = loan.amount + interest;

        require(msg.value >= totalDue, "Insufficient amount to repay the loan");

        // Update the loan status
        loan.isRepaid = true;

        // Handle the transfer of funds
        uint256 excessAmount = msg.value - totalDue;
        if(excessAmount > 0) {
            // Refund the excess amount to the borrower
            payable(msg.sender).transfer(excessAmount);
        }

        // Assuming the contract itself holds the funds. Otherwise, this would involve transferring to the lender.
        // If the contract isn't supposed to hold funds, remove this line.
        payable(owner).transfer(totalDue - loan.amount); // Transfer interest to the lender

        // Emit an event for successful repayment (Event definition required)
        // emit LoanRepaid(msg.sender, loan.amount, interest, block.timestamp);
    }
}






