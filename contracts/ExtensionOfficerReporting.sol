// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ExtensionOfficerReporting {
    address public owner;
    mapping(address => bool) public isExtensionOfficer;
    mapping(uint256 => string) public projectReports; // Mapping project ID to the report content
    mapping(uint256 => string) public alerts; // Mapping project ID to alerts

    event ReportSubmitted(uint256 indexed projectId, string reportContent);
    event AlertBroadcasted(uint256 indexed projectId, string alertMessage);
    event ExtensionOfficerAdded(address officer);
    event ExtensionOfficerRemoved(address officer);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    modifier onlyExtensionOfficer() {
        require(isExtensionOfficer[msg.sender], "Not an authorized extension officer");
        _;
    }

    function addExtensionOfficer(address officer) public onlyOwner {
        isExtensionOfficer[officer] = true;
        emit ExtensionOfficerAdded(officer);
    }

    function removeExtensionOfficer(address officer) public onlyOwner {
        isExtensionOfficer[officer] = false;
        emit ExtensionOfficerRemoved(officer);
    }

    function submitReport(uint256 projectId, string memory reportContent) public onlyExtensionOfficer {
        require(bytes(reportContent).length > 0, "Report content cannot be empty");
        projectReports[projectId] = reportContent;
        emit ReportSubmitted(projectId, reportContent);
    }

    function broadcastAlert(uint256 projectId, string memory alertMessage) public onlyExtensionOfficer {
        require(bytes(alertMessage).length > 0, "Alert message cannot be empty");
        alerts[projectId] = alertMessage;
        emit AlertBroadcasted(projectId, alertMessage);
    }

    function getReport(uint256 projectId) public view returns (string memory) {
        return projectReports[projectId];
    }

    function getAlert(uint256 projectId) public view returns (string memory) {
        return alerts[projectId];
    }
}
