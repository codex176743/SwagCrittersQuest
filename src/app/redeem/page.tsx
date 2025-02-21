"use client";

import { useState, useEffect } from "react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import RedeemNFT from "@/components/redeem/RedeemNFT";
import { useWallet } from "@solana/wallet-adapter-react";
import { MINT_AUTHORITY } from "@/config/solana";

const RedeemPage = () => {
  const { publicKey } = useWallet();
  const [RevealNFTs, setRevealNFTs] = useState<DigitalAssetWithToken[]>();

  useEffect(() => {
    if (!publicKey) {
      return;
    }

    const updateCollectionNFTs = async () => {
      const response = await fetch(`/api/nft?publickey=${publicKey}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: DigitalAssetWithToken[] = await response.json();
      setRevealNFTs(
        data.filter((nft) => {
          // Check if the collection exists and is verified
          const isCollectionVerified =
            nft.metadata.collection.__option === "Some" && // Check if the Option is Some
            nft.metadata.collection.value.verified; // Access the value if it exists

          return (
            isCollectionVerified &&
            nft.metadata.symbol === "SWAGBOX" &&
            nft.metadata.updateAuthority === MINT_AUTHORITY.toString()
          );
        })
      );
    };

    updateCollectionNFTs();
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="flex justify-center text-[50px] font-semibold">
        Please connect your wallet...
      </div>
    );
  }

  if (!RevealNFTs || RevealNFTs.length === 0) {
    return (
      <div className="flex justify-center text-[50px] font-semibold">
        No NFTs to redeem...
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-10 p-10 rounded-[50px] bg-black items-center">
        {RevealNFTs?.map((nft, index) => (
          <RedeemNFT key={index} nft={nft} />
        ))}
      </div>
    </div>
  );
};

export default RedeemPage;
