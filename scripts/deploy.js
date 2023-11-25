const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const balance = await deployer.getBalance();
    console.log(`Deployer balance: ${hre.ethers.utils.formatEther(balance)} ETH`);

    if (balance.lt(hre.ethers.utils.parseEther("0.1"))) {
        throw new Error('Insufficient funds for deployment');
    }

    // Deploy contracts
    console.log("Starting deployment...");
    const contractsToDeploy = [
        "EscrowAndFundsDistribution",
        "AgriculturalProjectManagement",
        "SalesAndRevenueManagement",
        "InvestorFarmerRegistration",
        // "LandMatchingAndProjectAssignment", // Uncomment if you want to deploy this
        "ExtensionOfficerReporting",
        // "AIAnalyticsIntegration", // Uncomment if you want to deploy this
        "InHouseLoanService"
    ];

    const deployedContracts = {};

    for (const contractName of contractsToDeploy) {
        const ContractFactory = await hre.ethers.getContractFactory(contractName);
        console.log(`Deploying ${contractName}...`);
        const contract = await ContractFactory.deploy();
        await contract.deployed();
        console.log(`${contractName} deployed to:`, contract.address);
        deployedContracts[contractName] = contract.address;
        // Save the contract address and ABI if it's InvestorFarmerRegistration
        if (contractName === "InvestorFarmerRegistration") {
            saveFrontendFiles(contract);
        }
    }
}

function saveFrontendFiles(contract) {
    const fs = require("fs");
    const path = require("path");
    const contractsDir = path.join(__dirname, "../frontend/src/contracts");

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir, { recursive: true });
    }

    const addressFilePath = path.join(contractsDir, "contract-address.json");
    const abiFilePath = path.join(contractsDir, "InvestorFarmerRegistration.json");

    fs.writeFileSync(
        addressFilePath,
        JSON.stringify({ InvestorFarmerRegistration: contract.address }, undefined, 2)
    );

    const contractArtifact = hre.artifacts.readArtifactSync("InvestorFarmerRegistration");

    fs.writeFileSync(
        abiFilePath,
        JSON.stringify(contractArtifact, null, 2)
    );
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
