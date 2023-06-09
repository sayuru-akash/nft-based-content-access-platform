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

    let wallet = new ethers.Wallet(
      process.env.WALLET_PRIVATE_KEY as string,
      provider
    );
    const signer = wallet.connect(provider);

    const myContract = new ethers.Contract(
      myContractAddress,
      myContractABI,
      provider
    );

    const { id } = req.query as { id: string };

    // const signer = provider.getSigner();
    const myContractWithSigner = myContract.connect(signer);

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

    if (!isNotBannedData.status) {
      res.status(401).json({ message: "This token is banned." });
      return;
    }

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
