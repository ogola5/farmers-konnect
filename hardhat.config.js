require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.21",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // Configuration for the local Hardhat network
    },
    sepolia: {
      url: "https://thrilling-virulent-dinghy.ethereum-sepolia.quiknode.pro/c2e0582ada626b6b5724cb461493e2129374ab14/",
      accounts: ["a283b2433fd6ec2609ec7e669900185908ae6377a85f0fac4445eecf2550d29b"],
    },
  },
  etherscan: {
    apiKey: "IP8KJMX95EWWSAYDF28IJT3DRKW7DIMBBB",
  }
};
