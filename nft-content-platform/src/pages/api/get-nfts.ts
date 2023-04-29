import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import nftMarket from "../../../public/NftMarket.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const myContractABI = nftMarket.abi;
    const myContractAddress = "0x82E9A535DE8148505BD1F2E0642193737440b044";

    const provider = new ethers.providers.JsonRpcProvider(
      "http://127.0.0.1:7545"
    );

    const myContract = new ethers.Contract(
      myContractAddress,
      myContractABI,
      provider
    );

    const signer = provider.getSigner();
    const myContractWithSigner = myContract.connect(signer);

    const getAllNftsOnSale = await myContractWithSigner.getAllNftsOnSale();

    const nftsOnSale = await Promise.all(
      getAllNftsOnSale.map(async (nft: any) => {
        const uri = await myContractWithSigner.tokenURI(nft.tokenId);
        const owner = await myContractWithSigner.ownerOf(nft.tokenId);
        return {
          tokenID: nft.tokenId,
          tokenURI: uri,
          price: ethers.utils.formatEther(nft.price),
          owner: owner,
        };
      })
    );

    res.status(200).json(nftsOnSale);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
