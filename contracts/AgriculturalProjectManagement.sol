// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgriculturalProjectManagement {
    address public owner;

    // Structure to hold project information
    struct Project {
        string name;
        uint256 startDate;
        uint256 endDate;
        string status;  // e.g., "Planning", "In Progress", "Completed"
        // Additional fields as required
    }

    // Mapping of project ID to Project
    mapping(uint256 => Project) public projects;

    // Event to emit when a project is updated
    event ProjectUpdated(uint256 projectId, string status);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    // Function to add or update a project
    function updateProject(uint256 projectId, string memory name, uint256 startDate, uint256 endDate, string memory status) public onlyOwner {
        projects[projectId] = Project(name, startDate, endDate, status);
        emit ProjectUpdated(projectId, status);
    }

    // Additional functions as required
}
