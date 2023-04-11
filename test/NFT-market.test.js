const NFTMarket = artifacts.require("NftMarket");
const { expectRevert } = require("@openzeppelin/test-helpers");
const { ethers } = require("hardhat");

contract("NftMarket", (accounts) => {
  let _contract = null;
  let _nftPrice = "1000000000000000000";
  let _listingPrice = 0.025 * 10 ** 18;

  before(async () => {
    _contract = await NFTMarket.deployed();
  });
  describe("Mint token", () => {
    const tokenURI = "https://www.mytokenlocation.com";
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
      });
    });
    it("owner of first token should be address[0]", async () => {
      const owner = await _contract.ownerOf(1);
      assert.equal(owner, accounts[0]),
        "Owner of first token is not address[0]";
    });
    it("first token should point to correct tokenURI", async () => {
      const actualTokenURI = await _contract.tokenURI(1);
      assert.equal(actualTokenURI, tokenURI),
        "URI of the first token is not correct";
    });
    it("should not be able to create NFT with duplicate tokenURI", async () => {
      await expectRevert(
        _contract.mintToken(tokenURI, _nftPrice, {
          from: accounts[0],
        }),
        "Token URI already exists"
      );
    });
    it("should have one listed item", async () => {
      const listedItem = await _contract.getListedItemsCount();
      assert.equal(listedItem, 1), "There should be only one listed item";
    });
    it("should have created a NFT with valid details", async () => {
      const nftItem = await _contract.getNftItem(1);
      assert.equal(nftItem.tokenId, 1), "Token id should be 1";
      assert.equal(nftItem.price, _nftPrice), "Token price should be valid";
      assert.equal(nftItem.creator, accounts[0]), "Token owner should be valid";
      assert.equal(nftItem.isListed, true), "Token should be listed";
    });
  });

  describe("Buy NFT", () => {
    before(async () => {
      const accounts = await ethers.getSigners();
      await _contract.buyNft(1, {
        from: ethers.utils.getAddress(accounts[1].address),
        value: _nftPrice,
      });
    });

    it("should unlist the item", async () => {
      const listedItem = await _contract.getNftItem(1);
      assert.equal(listedItem.isListed, false, "Item is still listed");
    });

    it("should decrease listed items count", async () => {
      const listedItemsCount = await _contract.getListedItemsCount();
      assert.equal(
        listedItemsCount.toNumber(),
        0,
        "Count has not been decrement"
      );
    });

    it("should change the owner", async () => {
      const currentOwner = await _contract.ownerOf(1);
      assert.equal(currentOwner, accounts[1], "Item is still listed");
    });
  });

  describe("Token transfers", () => {
    const tokenURI = "https://test-json-2.com";
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
      });
    });

    it("should have two NFTs created", async () => {
      const totalSupply = await _contract.totalSupply();
      assert.equal(
        totalSupply.toNumber(),
        2,
        "Total supply of token is not correct"
      );
    });

    it("should be able to retreive nft by index", async () => {
      const nftId1 = await _contract.tokenByIndex(0);
      const nftId2 = await _contract.tokenByIndex(1);

      assert.equal(nftId1.toNumber(), 1, "Nft id is wrong");
      assert.equal(nftId2.toNumber(), 2, "Nft id is wrong");
    });

    it("should have one listed NFT", async () => {
      const allNfts = await _contract.getAllNftsOnSale();
      assert.equal(allNfts[0].tokenId, 2, "Nft has a wrong id");
    });

    it("account[1] should have one owned NFT", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });
      assert.equal(ownedNfts[0].tokenId, 1, "Nft has a wrong id");
    });

    it("account[0] should have one owned NFT", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
      assert.equal(ownedNfts[0].tokenId, 2, "Nft has a wrong id");
    });
  });

  describe("Token transfer to new owner", () => {
    before(async () => {
      await _contract.transferFrom(accounts[0], accounts[1], 2);
    });

    it("accounts[0] should own 0 tokens", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
      assert.equal(ownedNfts.length, 0, "Invalid length of tokens");
    });

    it("accounts[1] should own 2 tokens", async () => {
      const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });
      assert.equal(ownedNfts.length, 2, "Invalid length of tokens");
    });
  });

  describe("List an Nft", () => {
    before(async () => {
      await _contract.placeNftOnSale(1, _nftPrice, {
        from: accounts[1],
        value: _listingPrice,
      });
    });

    it("should have two listed items", async () => {
      const listedNfts = await _contract.getAllNftsOnSale();

      assert.equal(listedNfts.length, 2, "Invalid length of Nfts");
    });

    it("should set new listing price", async () => {
      await _contract.setListingPrice(0.001 * 10 ** 18, { from: accounts[0] });
      const listingPrice = await _contract.listingPrice();

      assert.equal(listingPrice.toString(), 0.001 * 10 ** 18, "Invalid Price");
    });
  });
});
