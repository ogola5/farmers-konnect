// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InvestorFarmerRegistration {
    // Struct to hold minimal on-chain data
    struct Profile {
        string data; // Directly storing profile data
        bool isRegistered;
    }

    // Mappings for investor and farmer profiles
    mapping(address => Profile) public investorProfiles;
    mapping(address => Profile) public farmerProfiles;

    // Events for profile updates
    event InvestorProfileUpdated(address indexed investor, string newData);
    event FarmerProfileUpdated(address indexed farmer, string newData);

    // Modifier for profile ownership
    modifier onlyProfileOwner(address user, bool isInvestor) {
        if (isInvestor) {
            require(investorProfiles[user].isRegistered, "Investor not registered");
        } else {
            require(farmerProfiles[user].isRegistered, "Farmer not registered");
        }
        require(msg.sender == user, "Unauthorized: Only profile owner can update");
        _;
    }

    // Register an investor profile
    function registerInvestor(string memory data) public {
        require(!investorProfiles[msg.sender].isRegistered, "Investor already registered");
        investorProfiles[msg.sender] = Profile(data, true);
        emit InvestorProfileUpdated(msg.sender, data);
    }

    // Update an investor profile
    function updateInvestorProfile(string memory newData) public onlyProfileOwner(msg.sender, true) {
        investorProfiles[msg.sender].data = newData;
        emit InvestorProfileUpdated(msg.sender, newData);
    }

    // Register a farmer profile
    function registerFarmer(string memory data) public {
        require(!farmerProfiles[msg.sender].isRegistered, "Farmer already registered");
        farmerProfiles[msg.sender] = Profile(data, true);
        emit FarmerProfileUpdated(msg.sender, data);
    }

    // Update a farmer profile
    function updateFarmerProfile(string memory newData) public onlyProfileOwner(msg.sender, false) {
        farmerProfiles[msg.sender].data = newData;
        emit FarmerProfileUpdated(msg.sender, newData);
    }

    // Get the profile data of an investor
    function getInvestorProfile(address investor) public view returns (string memory) {
        require(investorProfiles[investor].isRegistered, "Investor not registered");
        return investorProfiles[investor].data;
    }

    // Get the profile data of a farmer
    function getFarmerProfile(address farmer) public view returns (string memory) {
        require(farmerProfiles[farmer].isRegistered, "Farmer not registered");
        return farmerProfiles[farmer].data;
    }
}
