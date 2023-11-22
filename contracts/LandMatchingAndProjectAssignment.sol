// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract LandMatchingAndProjectAssignment is ChainlinkClient {
    address private owner;
    using Chainlink for Chainlink.Request;

    // Structure to hold project details
    struct Project {
        uint256 projectId;
        address farmer;
        string projectDetails; // IPFS hash
        bool isActive;
        // Additional details can be included here
    }

    // Structure to hold investor details
    struct Investor {
        address investorAddress;
        uint256 investmentAmount;
        uint256 riskTolerance;
        // Additional details can be included here
    }

    mapping(uint256 => Project) public projects;
    mapping(address => Investor) public investors;

    uint256 public projectCount;
    uint256 private fee;
    bytes32 private jobId;
    address private oracle;

    event ProjectMatched(uint256 indexed projectId, address indexed investor);
    event ProjectStatusUpdated(uint256 indexed projectId, bool isActive);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor(address _oracle, string memory _jobId, uint256 _fee) {
        setPublicChainlinkToken();
        owner = msg.sender;
        oracle = _oracle;
        jobId = stringToBytes32(_jobId);
        fee = _fee;
    }

    // Function to register a new project
    function registerProject(uint256 _projectId, address _farmer, string memory _projectDetails) public onlyOwner {
        projects[_projectId] = Project(_projectId, _farmer, _projectDetails, true);
        projectCount++;
    }

    // Function to register a new investor
    function registerInvestor(address _investor, uint256 _investmentAmount, uint256 _riskTolerance) public onlyOwner {
        investors[_investor] = Investor(_investor, _investmentAmount, _riskTolerance);
    }

    // Algorithmic matching of investors to projects
    function matchInvestorToProject(address _investor, uint256 _projectId) public onlyOwner {
        // Logic to match investors with projects based on criteria
        // Emit an event after a successful match
        emit ProjectMatched(_projectId, _investor);
    }

    // Chainlink function to request external data
    function requestProjectStatusUpdate(uint256 _projectId) public onlyOwner returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        request.addUint("projectId", _projectId);
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    // Callback function for Chainlink
    function fulfill(bytes32 _requestId, bool _isActive) public recordChainlinkFulfillment(_requestId) {
        uint256 projectId = projectIdFromRequestId(_requestId);
        Project storage project = projects[projectId];
        project.isActive = _isActive;
        emit ProjectStatusUpdated(projectId, _isActive);
    }

    // Utility function to convert string to bytes32 for Chainlink Job ID
    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    // Utility function to derive projectId from Chainlink requestId
    function projectIdFromRequestId(bytes32 _requestId) private view returns (uint256) {
        // Logic to derive projectId from requestId
        // Placeholder: actual implementation will vary
        return uint256(_requestId);
    }

    // Additional helper functions as needed
}
