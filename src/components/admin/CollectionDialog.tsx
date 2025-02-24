"use client";

import React, { useState, useEffect } from "react";
import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAnchor } from "@/hooks/useAnchor";
import { useToast } from "@/hooks/use-toast";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import {
  SPL_TOKEN_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
  PROGRAM_ID,
} from "@/config/solana";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CollectionDialog = ({
  nft,
  open,
  setOpen,
}: {
  nft: DigitalAssetWithToken;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { program } = useAnchor();
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [description, setDescription] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>();
  const [allowMintDate, setAllowMintDate] = useState<Date>();
  const [delay, setDelay] = useState<number>(0);
  const [mintedNumber, setMintedNumber] = useState<number>(0);
  const [totalNumber, setTotalNumber] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const response = await fetch(nft.metadata.uri);
        const data = await response.json();
        setImageUrl(data.image);
        setDescription(data.description);
      } catch (error) {
        console.log("fetch metadata failed: ", error);
      }
    };

    const [collectionPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("collection_state"),
        new anchor.web3.PublicKey(nft.mint.publicKey).toBuffer(),
      ],
      PROGRAM_ID
    );

    const fetchCollectionState = async () => {
      const collectionState = await program.account.collectionState.fetch(
        collectionPDA
      );
      setMintedNumber(collectionState.mintCount);
      setTotalNumber(collectionState.countLimit);
      setCost(collectionState.costAmount.toNumber() / LAMPORTS_PER_SOL);
      setAllowMintDate(new Date(collectionState.allowTime.toNumber() * 1000));
      setDelay(collectionState.delayTime.toNumber() / 86400);
    };

    fetchMetaData();
    fetchCollectionState();
  }, []);

  const handleSubmit = async () => {
    if (!publicKey) {
      return;
    }

    setIsLoading(true);

    const mint = new PublicKey(nft.mint.publicKey);
    console.log("\nMint", mint.toBase58());
    const tokenAccount = getAssociatedTokenAddressSync(mint, publicKey);
    console.log("TokenAccount", tokenAccount.toBase58());

    try {
      const tx = await program.methods
        .burnNft()
        .accountsPartial({
          owner: publicKey,
          mint,
          tokenAccount,
          tokenProgram: SPL_TOKEN_PROGRAM_ID,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: SYSTEM_PROGRAM_ID,
        })
        .rpc({
          skipPreflight: true,
        });
      console.log("\nNFT Burned! Your transaction signature", tx);
      toast({
        variant: "default",
        description: "Collection NFT is burned!",
      });
      setIsLoading(false);
      setOpen(false);
    } catch (error) {
      console.log("Failed to burn NFT:", error);
      toast({
        variant: "destructive",
        description: "Failed to burn NFT!",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{nft.metadata.name}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>
          <img src={imageUrl} alt="Collection NFT Image" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Minted / Total Limit:</span>{" "}
            {mintedNumber} / {totalNumber}
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Cost Price:</span> {cost} SOL
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Allow Mint Date:</span>{" "}
            {allowMintDate?.toLocaleString()}
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delay Time:</span> {delay} days
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading}
            variant={"destructive"}
            className="w-full"
            onClick={handleSubmit}
          >
            {isLoading ? "Burning..." : "Burn NFT"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionDialog;
