const NFTMarket = artifacts.require("NftMarket");

module.exports = function (deployer) {
  deployer.deploy(NFTMarket);
};
