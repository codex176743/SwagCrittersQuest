"use client";

import { useState, useEffect } from "react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";

const NFTBox = ({ nft }: { nft: DigitalAssetWithToken }) => {
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

  return (
    <div className="flex border-2 border-white items-center">
      <img
        src={imageUrl}
        alt="NFTBox"
        className="w-[200px] h-[200px] bg-white"
      />
    </div>
  );
};

export default NFTBox;
