"use client";

import { useState, useEffect } from "react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAnchor } from "@/hooks/useAnchor";
import { useToast } from "@/hooks/use-toast";

const RedeemNFT = ({ nft }: { nft: DigitalAssetWithToken }) => {
  const { publicKey } = useWallet();

  if (!publicKey) {
    return;
  }

  const { program } = useAnchor();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const response = await fetch(nft.metadata.uri);
        const data = await response.json();
        setImageUrl(data.image);
      } catch (error) {
        console.log("fetch metadata failed: ", error);
      }
    };

    fetchMetaData();
  }, []);

  const handleClick = () => {
    console.log("Burn & Ship Clicked! Mint Address: ", nft.mint.publicKey);
  };

  return (
    <div className="flex flex-col gap-2 bg-black items-center">
      <img
        src={imageUrl}
        alt="revealed"
        className="w-[200px] h-[200px] bg-white"
      />
      <button
        className="bg-yellow-500 p-1 text-gray-500 font-semibold text-[24px] text-center"
        onClick={handleClick}
      >
        Burn & Ship
      </button>
    </div>
  );
};

export default RedeemNFT;
