"use client";

import { useState, useEffect } from "react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import { useWallet } from "@solana/wallet-adapter-react";
import BuyNFT from "@/components/buy/buy-nft";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { OWNER_PUBLICKEY } from "@/config/solana";

const BuyPage = () => {
  const { publicKey } = useWallet();
  const [collectionNFTs, setCollectionNFTs] =
    useState<DigitalAssetWithToken[]>();

  useEffect(() => {
    if (!publicKey) {
      return;
    }

    const updateCollectionNFTs = async () => {
      const response = await fetch(`/api/nft?publickey=${OWNER_PUBLICKEY}`, {
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

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="container mx-auto cursor-grab active:cursor-grabbing"
    >
      <CarouselContent>
        {collectionNFTs?.map((nft, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <BuyNFT nft={nft} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default BuyPage;
