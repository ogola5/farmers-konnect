const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EscrowAndFundsDistribution", function () {
    let Escrow;
    let escrow;
    let owner;
    let investor;
    let recipient;
    let otherAccount;

    beforeEach(async function () {
        // Deploy the contract before each test
        Escrow = await ethers.getContractFactory("EscrowAndFundsDistribution");
        [owner, investor, recipient, otherAccount] = await ethers.getSigners();
        escrow = await Escrow.deploy();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await escrow.owner()).to.equal(owner.address);
        });
    });

    describe("Transactions", function () {
        it("Should accept deposits", async function () {
            await investor.sendTransaction({ 
                to: escrow.address, 
                value: ethers.utils.parseEther("1.0") 
            });
            expect(await escrow.deposits(investor.address)).to.equal(ethers.utils.parseEther("1.0"));
        });

        it("Should allow owner to disburse funds", async function () {
            await investor.sendTransaction({ 
                to: escrow.address, 
                value: ethers.utils.parseEther("1.0") 
            });
            await escrow.connect(owner).disburse(recipient.address, ethers.utils.parseEther("1.0"));
            expect(await escrow.deposits(investor.address)).to.equal(0);
        });

        it("Should prevent non-owners from disbursing funds", async function () {
            await expect(escrow.connect(otherAccount).disburse(recipient.address, 1))
                .to.be.revertedWith("Only owner can call this function.");
        });

        it("Should handle fund returns correctly", async function () {
            await investor.sendTransaction({ 
                to: escrow.address, 
                value: ethers.utils.parseEther("1.0") 
            });
            await escrow.connect(owner).returnFunds(investor.address);
            expect(await escrow.deposits(investor.address)).to.equal(0);
        });

        it("Should prevent unauthorized returns of funds", async function () {
            await expect(escrow.connect(otherAccount).returnFunds(investor.address))
                .to.be.revertedWith("Only owner can call this function.");
        });
    });
});
