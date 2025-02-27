"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import MintDialog from "@/components/admin/MintDialog";
import CollectionNFT from "@/components/admin/CollectionNFT";
import { OWNER_PUBLICKEY } from "@/config/solana";
import { useToast } from "@/hooks/use-toast";
import RefreshIcon from "@/components/RefreshIcon";

const Admin = () => {
  const { publicKey } = useWallet();
  const [collectionNFTs, setCollectionNFTs] =
    useState<DigitalAssetWithToken[]>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!publicKey || publicKey?.toString() != OWNER_PUBLICKEY.toString()) {
    redirect("/home");
  }

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
    setCollectionNFTs(
      data.filter((nft) => nft.metadata.symbol == "COLLECTION")
    );
    setIsLoading(false);
  };

  useEffect(() => {
    if (!publicKey) {
      return;
    }

    updateCollectionNFTs();
  }, [publicKey]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col rounded-[50px] bg-black py-5 gap-5">
        <div className="flex justify-between px-6">
          <MintDialog />
          <RefreshIcon loading={isLoading} onClick={updateCollectionNFTs} />
        </div>
        {!CollectionNFT || CollectionNFT.length == 0 ? (
          <div className="flex justify-center text-[50px] font-semibold text-white">
            No Collection NFT to show...
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-10 px-20">
            {collectionNFTs?.map((nft, index) => (
              <CollectionNFT key={index} nft={nft} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
