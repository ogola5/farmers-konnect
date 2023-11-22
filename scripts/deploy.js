const hre = require("hardhat");
const ethers = hre.ethers;

//onst hre = require("hardhat");

async function main() {
    // Get the contract factory for EscrowAndFundsDistribution
    const EscrowAndFundsDistribution = await hre.ethers.getContractFactory("EscrowAndFundsDistribution");

    // Deploy the contract
    console.log("Deploying EscrowAndFundsDistribution...");
    const escrowAndFundsDistribution = await EscrowAndFundsDistribution.deploy();

    // Wait for the deployment to be mined
    await escrowAndFundsDistribution.deployed();

    console.log("EscrowAndFundsDistribution deployed to:", escrowAndFundsDistribution.address);

    // Deploying AgriculturalProjectManagement contract
    const AgriculturalProjectManagement = await ethers.getContractFactory("AgriculturalProjectManagement");
    console.log("Deploying AgriculturalProjectManagement...");
    const agriculturalProjectManagement = await AgriculturalProjectManagement.deploy();
    await agriculturalProjectManagement.deployed();
    console.log("AgriculturalProjectManagement deployed to:", agriculturalProjectManagement.address);

    // Deploying SalesAndRevenueManagement contract
    const SalesAndRevenueManagement = await ethers.getContractFactory("SalesAndRevenueManagement");
    console.log("Deploying SalesAndRevenueManagement...");
    const salesAndRevenueManagement = await SalesAndRevenueManagement.deploy();
    await salesAndRevenueManagement.deployed();
    console.log("SalesAndRevenueManagement deployed to:", salesAndRevenueManagement.address);

    // Deploying InvestorFarmerRegistration contract
    const InvestorFarmerRegistration = await hre.ethers.getContractFactory("InvestorFarmerRegistration");
    console.log("Deploying InvestorFarmerRegistration...");
    const investorFarmerRegistration = await InvestorFarmerRegistration.deploy();
    await investorFarmerRegistration.deployed();
    console.log("InvestorFarmerRegistration deployed to:", investorFarmerRegistration.address);

    // Deploying LandMatchingAndProjectAssignment contract
    // const LandMatchingAndProjectAssignment = await ethers.getContractFactory("LandMatchingAndProjectAssignment");
    // console.log("Deploying LandMatchingAndProjectAssignment...");
    // const landMatchingAndProjectAssignment = await LandMatchingAndProjectAssignment.deploy();
    // await landMatchingAndProjectAssignment.deployed();
    // console.log("LandMatchingAndProjectAssignment deployed to:", landMatchingAndProjectAssignment.address);

    // Deploying ExtensionOfficerReporting contract
    const ExtensionOfficerReporting = await ethers.getContractFactory("ExtensionOfficerReporting");
    console.log("Deploying ExtensionOfficerReporting...");
    const extensionOfficerReporting = await ExtensionOfficerReporting.deploy();
    await extensionOfficerReporting.deployed();
    console.log("ExtensionOfficerReporting deployed to:", extensionOfficerReporting.address);

    // Deploying AIAnalyticsIntegration contract
    const AIAnalyticsIntegration = await ethers.getContractFactory("AIAnalyticsIntegration");
    console.log("Deploying AIAnalyticsIntegration...");
    // oracleAddress, jobId, and fee are placeholders for the actual values you want to use. You'll need to replace them with the appropriate values for your use case
    const aiAnalyticsIntegration = await AIAnalyticsIntegration.deploy(oracleAddress, jobId, fee);
    await aiAnalyticsIntegration.deployed();
    console.log("AIAnalyticsIntegration deployed to:", aiAnalyticsIntegration.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exit(1);
});

