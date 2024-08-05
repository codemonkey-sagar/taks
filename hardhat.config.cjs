require("@nomiclabs/hardhat-ethers");
require('dotenv').config(); // To use environment variables from a .env file

module.exports = {
  solidity: "0.8.0",
  paths: {
    sources: "./web3/contracts",
  },
  networks: {
    sepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY] // Access the private key from environment variables
    }
  }
};
