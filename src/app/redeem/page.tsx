"use client";

import { useState, useEffect } from "react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import RedeemNFT from "@/components/redeem/RedeemNFT";
import { useWallet } from "@solana/wallet-adapter-react";
import { MINT_AUTHORITY } from "@/config/solana";
import { useToast } from "@/hooks/use-toast";
import RefreshIcon from "@/components/RefreshIcon";

const RedeemPage = () => {
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [RevealNFTs, setRevealNFTs] = useState<DigitalAssetWithToken[]>();
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
    <div className="container mx-auto">
      <div className="flex flex-col gap-2 rounded-[50px] py-5 bg-black">
        <div className="flex justify-end px-5">
          <RefreshIcon loading={isLoading} onClick={updateCollectionNFTs} />
        </div>
        {!RevealNFTs || RevealNFTs.length == 0 ? (
          <div className="flex justify-center text-[50px] font-semibold text-white">
            No NFTs to redeem...
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-10 px-12">
            {RevealNFTs?.map((nft, index) => (
              <RedeemNFT key={index} nft={nft} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RedeemPage;
