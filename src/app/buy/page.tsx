"use client";

import { useState, useEffect } from "react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { OWNER_PUBLICKEY } from "@/config/solana";
import BuyNFT from "@/components/buy/BuyNFT";

const BuyPage = () => {
  const [collectionNFTs, setCollectionNFTs] =
    useState<DigitalAssetWithToken[]>();
  const { toast } = useToast();

  useEffect(() => {
    const updateCollectionNFTs = async () => {
      const response = await fetch(`/api/nft?publickey=${OWNER_PUBLICKEY}`, {
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
      }

      const data: DigitalAssetWithToken[] = await response.json();
      setCollectionNFTs(
        data.filter((nft) => nft.metadata.symbol == "COLLECTION")
      );
    };

    updateCollectionNFTs();
  }, []);

  if (!collectionNFTs || collectionNFTs.length === 0) {
    return (
      <div className="flex justify-center text-[50px] font-semibold">
        Coming Soon...
      </div>
    );
  }

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
