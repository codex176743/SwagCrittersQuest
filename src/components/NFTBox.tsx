"use client";

import { useState, useEffect } from "react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";

const NFTBox = ({
  nft,
  setOpen,
}: {
  nft: DigitalAssetWithToken;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
    <div
      className="flex border-2 w-[200px] border-white items-center hover:cursor-pointer"
      onClick={() => setOpen(true)}
    >
      <img
        src={imageUrl}
        alt="NFT Image"
        className="w-[200px] h-[200px] bg-white"
      />
    </div>
  );
};

export default NFTBox;
