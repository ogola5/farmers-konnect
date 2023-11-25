// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Agricultural Project Management
 * @dev Implements project management for agricultural projects with owner-based access control.
 */
contract AgriculturalProjectManagement {
    address public owner;

    /**
     * @dev Enum for defining possible states of a project.
     */
    enum ProjectStatus { Planning, InProgress, Completed }

    /**
     * @dev Struct to store detailed information about a project.
     */
    struct Project {
        string name;
        uint256 startDate;
        uint256 endDate;
        ProjectStatus status;
    }

    mapping(uint256 => Project) public projects;

    /**
     * @dev Event to be emitted when a project is updated.
     * @param projectId The unique identifier of the project.
     * @param name The name of the project.
     * @param startDate The start date of the project.
     * @param endDate The end date of the project.
     * @param status The current status of the project.
     */
    event ProjectUpdated(uint256 projectId, string name, uint256 startDate, uint256 endDate, ProjectStatus status);

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
     * @dev Updates or adds a new project.
     * @param projectId The unique identifier of the project.
     * @param name The name of the project.
     * @param startDate The start date of the project.
     * @param endDate The end date of the project.
     * @param status The status of the project.
     * @notice Ensures endDate is later than startDate and emits the ProjectUpdated event.
     */
    function updateProject(uint256 projectId, string memory name, uint256 startDate, uint256 endDate, ProjectStatus status) public onlyOwner {
        require(endDate > startDate, "End date must be after start date.");
        projects[projectId] = Project(name, startDate, endDate, status);
        emit ProjectUpdated(projectId, name, startDate, endDate, status);
    }

    /**
     * @dev Retrieves the details of a project by its ID.
     * @param projectId The unique identifier of the project.
     * @return Project The project details including name, startDate, endDate, and status.
     */
    function getProject(uint256 projectId) public view returns (Project memory) {
        return projects[projectId];
    }

    // Additional functions as required
}
