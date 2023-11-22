// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InvestorFarmerRegistration {
    // Struct to hold minimal on-chain data
    struct Profile {
        string ipfsHash; // IPFS hash for detailed profile data
        bool isRegistered;
    }

    // Mappings for investor and farmer profiles
    mapping(address => Profile) public investorProfiles;
    mapping(address => Profile) public farmerProfiles;

    // Events for profile updates
    event InvestorProfileUpdated(address indexed investor, string newIpfsHash);
    event FarmerProfileUpdated(address indexed farmer, string newIpfsHash);

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
    function registerInvestor(string memory ipfsHash) public {
        require(!investorProfiles[msg.sender].isRegistered, "Investor already registered");
        investorProfiles[msg.sender] = Profile(ipfsHash, true);
        emit InvestorProfileUpdated(msg.sender, ipfsHash);
    }

    // Update an investor profile
    function updateInvestorProfile(string memory newIpfsHash) public onlyProfileOwner(msg.sender, true) {
        investorProfiles[msg.sender].ipfsHash = newIpfsHash;
        emit InvestorProfileUpdated(msg.sender, newIpfsHash);
    }

    // Register a farmer profile
    function registerFarmer(string memory ipfsHash) public {
        require(!farmerProfiles[msg.sender].isRegistered, "Farmer already registered");
        farmerProfiles[msg.sender] = Profile(ipfsHash, true);
        emit FarmerProfileUpdated(msg.sender, ipfsHash);
    }

    // Update a farmer profile
    function updateFarmerProfile(string memory newIpfsHash) public onlyProfileOwner(msg.sender, false) {
        farmerProfiles[msg.sender].ipfsHash = newIpfsHash;
        emit FarmerProfileUpdated(msg.sender, newIpfsHash);
    }

    // Get the IPFS hash of an investor profile
    function getInvestorProfile(address investor) public view returns (string memory) {
        require(investorProfiles[investor].isRegistered, "Investor not registered");
        return investorProfiles[investor].ipfsHash;
    }

    // Get the IPFS hash of a farmer profile
    function getFarmerProfile(address farmer) public view returns (string memory) {
        require(farmerProfiles[farmer].isRegistered, "Farmer not registered");
        return farmerProfiles[farmer].ipfsHash;
    }
}
