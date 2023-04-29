import { Signer, ethers } from "ethers";
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

    const { id } = req.query as { id: string };

    const signer = provider.getSigner();
    const myContractWithSigner = myContract.connect(signer);
    const signerAddress = await signer.getAddress();

    const getNftItem = await myContractWithSigner.getNftItem(id);

    if (getNftItem.creator === "0x0000000000000000000000000000000000000000") {
      res.status(404).json({ message: "NFT not found" });
      return;
    }

    const uri = await myContractWithSigner.tokenURI(getNftItem.tokenId);
    const owner = await myContractWithSigner.ownerOf(getNftItem.tokenId);

    // if (owner !== signerAddress) {
    //   res.status(401).json({ message: "You are not the owner of this NFT" });
    //   console.log("signerAddress", signerAddress, "ownerAddress", owner);
    //   return;
    // }

    const nftItem = {
      tokenID: getNftItem.tokenId,
      tokenURI: uri,
      price: ethers.utils.formatEther(getNftItem.price),
      owner: owner,
      isListed: getNftItem.isListed,
    };

    res.status(200).json(nftItem);
  } catch (error) {
    res.status(500).json(error);
  }
}
