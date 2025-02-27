"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import RevealNFT from "@/components/reveal/RevealNFT";
import { MINT_AUTHORITY } from "@/config/solana";
import { useToast } from "@/hooks/use-toast";
import RefreshIcon from "@/components/RefreshIcon";
// import Roulette from "@/components/reveal/Roulette";

const RevealPage = () => {
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [unRevealNFTs, setUnRevealNFTs] = useState<DigitalAssetWithToken[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateCollectionNFTs = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/nft?publickey=${publicKey}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast({
        variant: "destructive",
        description: "NFT Fetch Error!",
      });
      setIsLoading(false);
    }

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
    setIsLoading(false);
  };

  useEffect(() => {
    if (!publicKey) {
      return;
    }

    updateCollectionNFTs();
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="flex justify-center text-[50px] font-semibold">
        Coming Soon...
      </div>
    );
  }

  return (
    <div className="flex flex-col container mx-auto gap-10">
      <div className="flex flex-col gap-2 rounded-[50px] py-5 bg-black">
        <div className="flex justify-end px-5">
          <RefreshIcon loading={isLoading} onClick={updateCollectionNFTs} />
        </div>
        {!unRevealNFTs || unRevealNFTs.length == 0 ? (
          <div className="flex justify-center text-[50px] font-semibold text-white">
            No NFTs to reveal...
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-10 px-20">
            {unRevealNFTs?.map((nft, index) => (
              <RevealNFT key={index} nft={nft} />
            ))}
          </div>
        )}
      </div>
      {/* <Roulette /> */}
    </div>
  );
};

export default RevealPage;
