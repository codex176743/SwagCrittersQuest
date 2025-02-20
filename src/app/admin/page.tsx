"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import MintDialog from "@/components/admin/MintDialog";
import CollectionNFT from "@/components/admin/CollectionNFT";
import { OWNER_PUBLICKEY } from "@/config/solana";
import { redirect } from "next/navigation";

const Admin = () => {
  const { publicKey } = useWallet();
  const [collectionNFTs, setCollectionNFTs] =
    useState<DigitalAssetWithToken[]>();

  if (!publicKey || publicKey?.toString() != OWNER_PUBLICKEY.toString()) {
    redirect("/home");
  }

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
      setCollectionNFTs(
        data.filter((nft) => nft.metadata.symbol == "COLLECTION")
      );
    };

    updateCollectionNFTs();
  }, [publicKey]);

  if (!collectionNFTs || collectionNFTs?.length === 0) {
    return (
      <div className="flex justify-center text-[50px] font-semibold">
        No Collection NFTs...
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col rounded-[50px] bg-black px-20 py-5 gap-5">
        <MintDialog />
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-10 items-center">
          {collectionNFTs?.map((nft, index) => (
            <CollectionNFT key={index} nft={nft} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
