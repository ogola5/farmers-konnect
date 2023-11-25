// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InvestorFarmerRegistration {
    enum UserType { Investor, Farmer }

    // Struct to hold profile data
    struct Profile {
        string name;
        string email; // Consider risks of storing PII on-chain
        UserType userType;
        bool isActive;
    }

    // Mappings for profiles
    mapping(address => Profile) private profiles;
    
    // Public mapping to check if an address is registered
    mapping(address => bool) public isRegistered;

    // Events for profile creation and updates
    event ProfileCreated(address indexed user, UserType userType, string name, string email);
    event ProfileUpdated(address indexed user, UserType userType, string name, string email);
    event ProfileDeactivated(address indexed user, UserType userType);

    // Modifier for profile ownership
    modifier onlyProfileOwner(address user) {
        require(isRegistered[user], "Profile not registered");
        require(msg.sender == user, "Unauthorized: Only profile owner can update");
        _;
    }

    // Modifier to validate email format
    modifier validEmail(string memory email) {
        // Simplistic check; consider off-chain validation for more complex patterns
        require(bytes(email).length > 5 && bytes(email)[bytes(email).length - 4] == '.', "Invalid email format");
        _;
    }

    // Register a profile
    function registerProfile(string memory name, string memory email, UserType userType) public validEmail(email) {
        require(!isRegistered[msg.sender], "Address already registered");
        profiles[msg.sender] = Profile(name, email, userType, true);
        isRegistered[msg.sender] = true;
        emit ProfileCreated(msg.sender, userType, name, email);
    }

    // Update a profile
    function updateProfile(string memory name, string memory email) public onlyProfileOwner(msg.sender) validEmail(email) {
        Profile storage profile = profiles[msg.sender];
        profile.name = name;
        profile.email = email;
        emit ProfileUpdated(msg.sender, profile.userType, name, email);
    }

    // Deactivate a profile
    function deactivateProfile() public onlyProfileOwner(msg.sender) {
        Profile storage profile = profiles[msg.sender];
        profile.isActive = false;
        emit ProfileDeactivated(msg.sender, profile.userType);
    }

    // Reactivate a profile
    function reactivateProfile() public onlyProfileOwner(msg.sender) {
        Profile storage profile = profiles[msg.sender];
        require(!profile.isActive, "Profile is already active");
        profile.isActive = true;
        emit ProfileUpdated(msg.sender, profile.userType, profile.name, profile.email);
    }

    // Get the profile data
    function getProfile(address user) public view returns (Profile memory) {
        require(isRegistered[user], "Profile not registered");
        return profiles[user];
    }
}
