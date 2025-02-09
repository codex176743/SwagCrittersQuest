"use client";

import { useEffect, useState } from "react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";

const UnRevealedNFT = ({ nft }: { nft: DigitalAssetWithToken }) => {
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const data = await fetch(nft.metadata.uri).then((res) => res.json());
        setImageUrl(data["image"]);
      } catch (error) {
        console.log("fetch metadata failed: ", error);
      }

      if (!imageUrl) {
        setImageUrl("/images/unrevealed.jpg");
      }
    };

    fetchMetaData();
  }, []);

  const handleClick = (mint: string) => {
    console.log("Reveal Clicked! Mint Address", mint);
  };

  return (
    <div className="flex flex-col gap-2 bg-black items-center">
      <img src={imageUrl} alt="unrevealed" className="w-[200px] h-[200px]" />
      <button
        className="bg-yellow-500 p-1 text-gray-500 font-semibold text-[24px] text-center"
        onClick={() => handleClick(nft.mint.publicKey)}
      >
        Reveal
      </button>
    </div>
  );
};

export default UnRevealedNFT;
