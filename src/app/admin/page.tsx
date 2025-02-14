"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import MintDialog from "@/components/admin/mint-dialog";
import CollectionMint from "@/components/admin/collection-nft";

const Admin = () => {
  const { publicKey } = useWallet();
  const [collectionNFTs, setCollectionNFTs] =
    useState<DigitalAssetWithToken[]>();

  useEffect(() => {
    console.log(publicKey);
    if (!publicKey) {
      return;
    }

    const fetchAllNFTs = async () => {
      const response = await fetch(`/api/admin?publickey=${publicKey}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: DigitalAssetWithToken[] = await response.json();
      console.log(
        "All NFTs:",
        data.filter((nft) => nft.metadata.symbol == "COLLECTION")
      );
      setCollectionNFTs(data);
    };

    fetchAllNFTs();
  }, [publicKey]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col rounded-[50px] bg-black px-20 py-5 gap-5">
        <MintDialog />
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-10 items-center">
          {collectionNFTs?.map((nft, index) => (
            <CollectionMint key={index} nft={nft} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
