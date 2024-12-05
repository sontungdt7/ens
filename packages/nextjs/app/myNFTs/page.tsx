"use client";

import { MyHoldings } from "./_components";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { addToIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import nftsMetadata from "~~/utils/simpleNFT/nftsMetadata";

const MyNFTs: NextPage = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();

  const { writeContractAsync } = useScaffoldWriteContract("ENS");

  const { data: tokenIdCounter } = useScaffoldReadContract({
    contractName: "ENS",
    functionName: "tokenCounter",
    watch: true,
  });

  const handleMintItem = async () => {
    // circle back to the zero item if we've reached the end of the array
    console.log("handleMintItem:", tokenIdCounter);
    if (tokenIdCounter === undefined) return;
    console.log("handleMintItem");

    const tokenIdCounterNumber = Number(tokenIdCounter);
    const currentTokenMetaData = nftsMetadata[tokenIdCounterNumber % nftsMetadata.length];
    const notificationId = notification.loading("Minting...");
    try {
      // const uploadedItem = await addToIPFS(currentTokenMetaData);      

      await writeContractAsync({
        functionName: "mint",        
      });
      // First remove previous loading notification and then show success notification
      notification.remove(notificationId);
      notification.success("Mint Success");

    } catch (error) {
      notification.remove(notificationId);
      console.error(error);
    }

    
  };

  return (
    <>
      <div className="flex items-center flex-col pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold">Ethereum's North Star NFT Collection</span>
          </h1>
        </div>
      </div>
      <div className="flex justify-center">
        {!isConnected || isConnecting ? (
          <RainbowKitCustomConnectButton />
        ) : (
          <button className="btn btn-secondary" onClick={handleMintItem}>
            Free Mint NFT
          </button>
        )}
      </div>
      <MyHoldings />
    </>
  );
};

export default MyNFTs;
