require("@nomiclabs/hardhat-ethers");
require('dotenv').config(); // To use environment variables from a .env file

module.exports = {
  solidity: {
    version: "0.8.26", // Ensure this matches the version used in your contracts
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Configure optimization settings as needed
      },
      outputSelection: {
        "*": {
          "*": ["metadata", "evm.bytecode", "evm.deployedBytecode", "abi"],
          "": ["ast"],
        },
      },
    },
  },
  paths: {
    sources: "./web3/contracts", // Path to your contracts
    artifacts: "./artifacts", // Path to store compiled contract artifacts
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.base.org", // Use environment variable for the RPC URL
      accounts: [process.env.PRIVATE_KEY] // Access the private key from environment variables
    }
  }
};
