import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import nftMarket from "../../../public/NftMarket.json";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const myContractABI = nftMarket.abi;
    const myContractAddress = process.env
      .NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS as "0x${string}";

    // const provider = new ethers.providers.JsonRpcProvider(
    //   "http://127.0.0.1:7545"
    // );

    const provider = new ethers.providers.InfuraProvider("sepolia", {
      projectId: process.env.INFURA_API_KEY,
      projectSecret: process.env.INFURA_API_SECRET,
    });

    const myContract = new ethers.Contract(
      myContractAddress,
      myContractABI,
      provider
    );

    const { id, address } = req.query;
    if (address === "" || id === "") {
      res.status(400).json({ message: "Missing address or id" });
      return;
    }
    const myContractWithSigner = myContract.connect(address as string);

    const getNftItem = await myContractWithSigner.getNftItem(id);

    if (getNftItem.creator === "0x0000000000000000000000000000000000000000") {
      res.status(404).json({ message: "NFT not found" });
      return;
    }

    const uri = await myContractWithSigner.tokenURI(getNftItem.tokenId);
    const owner = await myContractWithSigner.ownerOf(getNftItem.tokenId);
    const isNotBanned = await fetch(
      process.env.NEXT_PUBLIC_SERVER_URL + "/content/status/" + id
    );
    const isNotBannedData = await isNotBanned.json();
    console.log(isNotBannedData.status);

    if (!isNotBannedData.status) {
      res.status(40).json({ message: "Banned" });
      return;
    }

    if (address !== owner) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    res.status(200).json({
      tokenID: getNftItem.tokenId,
      tokenURI: uri,
      owner: owner,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
