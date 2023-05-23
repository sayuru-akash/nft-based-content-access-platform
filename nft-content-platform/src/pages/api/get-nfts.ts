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

    // const signer = provider.getSigner();
    const myContractWithSigner = myContract.connect(signer);

    const getAllNftsOnSale = await myContractWithSigner.getAllNftsOnSale();

    const nftsOnSale = await Promise.all(
      getAllNftsOnSale.map(async (nft: any) => {
        const uri = await myContractWithSigner.tokenURI(nft.tokenId);
        const owner = await myContractWithSigner.ownerOf(nft.tokenId);
        const allowed = await fetch(
          process.env.NEXT_PUBLIC_SERVER_URL +
            "/content/status/" +
            nft[0]._hex.toString()
        )
          .then((res) => res.json())
          .then((res) => res.status);

        return {
          tokenID: nft.tokenId,
          tokenURI: uri,
          price: ethers.utils.formatEther(nft.price),
          owner: owner,
          allowed: allowed,
        };
      })
    );

    const nftsOnSaleFiltered = nftsOnSale.filter((nft) => nft.allowed === true);

    res.status(200).json(nftsOnSaleFiltered);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
