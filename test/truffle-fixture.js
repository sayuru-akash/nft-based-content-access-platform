const NftMarket = artifacts.require("NftMarket");

module.exports = async () => {
  const nftMarket = await NftMarket.new();
  NftMarket.setAsDeployed(nftMarket);
};
