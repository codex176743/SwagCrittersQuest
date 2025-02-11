"use client";

import { useEffect, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { getMetadata } from "@/lib/solana";
import { useAnchor } from "@/hooks/useAnchor";
import {
  COLLECTION_MINT,
  MINT_AUTHORITY,
  SYSTEM_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
} from "@/config";
import { useToast } from "@/hooks/use-toast";
import NFTDialog from "./nft-dialog";

const RevealNFT = ({ nft }: { nft: DigitalAssetWithToken }) => {
  const { publicKey } = useWallet();
  const { program } = useAnchor();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

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

  const handleClick = async () => {
    if (!publicKey) {
      return;
    }

    console.log("Reveal Clicked! Mint Address", nft.mint.publicKey);

    setIsLoading(true);

    const mintAddress = new PublicKey(nft.mint.publicKey);
    const mintMetadata = await getMetadata(mintAddress);

    const nft_name = "Critters";
    const delay_time = 0;

    try {
      const tx = await program.methods
        .revealNft(nft_name, new anchor.BN(delay_time))
        .accountsPartial({
          owner: publicKey,
          mint: mintAddress,
          metadata: mintMetadata,
          updateAuthority: MINT_AUTHORITY,
          collectionMint: COLLECTION_MINT,
          systemProgram: SYSTEM_PROGRAM_ID,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        })
        .rpc({
          skipPreflight: true,
        });
      console.log("\nNFT Revealed! Your transaction signature", tx);

      toast({
        title: "NFT Revealed!",
        description: "You NFT Revealing is Success.",
      });

      setOpen(true);
    } catch (err) {
      console.error("Failed to reveal NFT:", err);
      toast({
        variant: "destructive",
        description: "Failed to reveal NFT!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-black items-center">
      <img
        src={imageUrl}
        alt="unrevealed"
        className="w-[200px] h-[200px] bg-white"
      />
      <button
        disabled={isLoading}
        className="bg-yellow-500 p-1 text-gray-500 font-semibold text-[24px] text-center"
        onClick={() => handleClick()}
      >
        Reveal
      </button>
      <NFTDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default RevealNFT;
