require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-truffle5");
require("@nomicfoundation/hardhat-verify");

module.exports = {
  solidity: "0.8.19",
  networks: {
    ganache: {
      url: process.env.GANACHE_URL,
      accounts: [
        process.env.GANACHE_WALLET_PRIVATE_KEY,
        process.env.GANACHE_WALLET_PRIVATE_KEY_2,
        process.env.GANACHE_WALLET_PRIVATE_KEY_3,
      ],
    },
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_URL,
      accounts: [
        process.env.METAMASK_WALLET_PRIVATE_KEY,
        process.env.METAMASK_WALLET_PRIVATE_KEY_2,
      ],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
