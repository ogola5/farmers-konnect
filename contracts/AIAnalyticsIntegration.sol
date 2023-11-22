// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract AIAnalyticsIntegration is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    address private owner;
    bytes32 private jobId;
    uint256 private fee;
    address private oracle;

    // Mapping to store AI insights (IPFS hash)
    mapping(uint256 => string) public projectInsights;

    event AIRequestInitiated(uint256 indexed projectId, string dataHash);
    event AIInsightUpdated(uint256 indexed projectId, string insightHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    constructor(address _oracle, bytes32 _jobId, uint256 _fee) {
        setPublicChainlinkToken();
        owner = msg.sender;
        oracle = _oracle;
        jobId = _jobId;
        fee = _fee;
    }

    // Function to initiate AI analysis request
    function requestAIAnalysis(uint256 projectId, string memory dataHash) public onlyOwner {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req.add("projectId", uint2str(projectId));
        req.add("dataHash", dataHash);
        sendChainlinkRequestTo(oracle, req, fee);
        emit AIRequestInitiated(projectId, dataHash);
    }

    // Callback function for Chainlink
    function fulfill(bytes32 _requestId, bytes32 _insightHash) public recordChainlinkFulfillment(_requestId) {
        uint256 projectId = uint256(_requestId);
        projectInsights[projectId] = bytes32ToString(_insightHash);
        emit AIInsightUpdated(projectId, projectInsights[projectId]);
    }

    // Helper function to convert uint256 to string
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    // Helper function to convert bytes32 to string
    function bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
        bytes memory bytesArray = new bytes(32);
        for (uint256 i; i < 32; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    // Additional functions as needed
}
