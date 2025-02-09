"use client";

import { useEffect, useState } from "react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { getMetadata } from "@/lib/solana";
import { useAnchor } from "@/hooks/useAnchor";
import {
  COLLECTION_MINT,
  MINT_AUTHORITY,
  TOKEN_METADATA_PROGRAM_ID,
} from "@/config";
import { useToast } from "@/hooks/use-toast";
import { getNFTMetadata } from "@/lib/get-nft-metadata";

const UnRevealedNFT = ({ nft }: { nft: DigitalAssetWithToken }) => {
  const { publicKey } = useWallet();

  if (!publicKey) {
    return;
  }

  const { program } = useAnchor();
  const { toast } = useToast();
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

  const handleClick = async (mint: string) => {
    console.log("Reveal Clicked! Mint Address", mint);
    const mintAddress = new PublicKey(mint);
    const mintMetadata = await getMetadata(mintAddress);

    const new_uri =
      "ipfs://bafkreiepq7s6y3tctidp5ihdymrb2h2wb7dteniays3g7yijzmi3qrhtf4";

    try {
      const tx = await program.methods
        .revealNft(new_uri)
        .accountsPartial({
          owner: publicKey,
          mint: mintAddress,
          metadata: mintMetadata,
          updateAuthority: MINT_AUTHORITY,
          collectionMint: COLLECTION_MINT,
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

      try {
        const asset = await getNFTMetadata(mint);
        const data = await fetch(asset.uri).then((res) => res.json());
        console.log("Updated Image URL", data["image"]);
      } catch (error) {
        console.log("fetch metadata failed: ", error);
      }
    } catch (err) {
      console.error("Failed to reveal NFT:", err);
      toast({
        variant: "destructive",
        description: "Failed to reveal NFT!",
      });
    }
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
