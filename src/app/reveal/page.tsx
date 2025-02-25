"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import RevealNFT from "@/components/reveal/RevealNFT";
import { MINT_AUTHORITY } from "@/config/solana";
// import Roulette from "@/components/reveal/Roulette";

const RevealPage = () => {
  const { publicKey } = useWallet();
  const [unRevealNFTs, setUnRevealNFTs] = useState<DigitalAssetWithToken[]>();

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
        cache: "no-cache",
      });

      const data: DigitalAssetWithToken[] = await response.json();
      setUnRevealNFTs(
        data.filter((nft) => {
          // Check if the collection exists and is verified
          const isCollectionVerified =
            nft.metadata.collection.__option === "Some" && // Check if the Option is Some
            nft.metadata.collection.value.verified; // Access the value if it exists

          return (
            isCollectionVerified &&
            nft.metadata.symbol === "BLACKBOX" &&
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
        Coming Soon...
      </div>
    );
  }

  if (!unRevealNFTs || unRevealNFTs.length == 0) {
    return (
      <div className="flex justify-center text-[50px] font-semibold">
        No NFTs to reveal...
      </div>
    );
  }

  return (
    <div className="flex flex-col container mx-auto gap-10">
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-10 p-10 rounded-[50px] bg-black items-center">
        {unRevealNFTs?.map((nft, index) => (
          <RevealNFT key={index} nft={nft} />
        ))}
      </div>
      {/* <Roulette /> */}
    </div>
  );
};

export default RevealPage;
