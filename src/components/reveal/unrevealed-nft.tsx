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
    console.log("Reveal Clicked! Mint Address", nft.mint.publicKey);
    const mintAddress = new PublicKey(nft.mint.publicKey);
    const mintMetadata = await getMetadata(mintAddress);

    const new_uri =
      "https://ipfs.io/ipfs/bafkreigr4akedly3kv4el272i3qtaqak3n4lz6m76bgx3rzcxs6zy3udom";

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

      // try {
      //   const asset = await getNFTMetadata(nft.mint.publicKey);
      //   const data = await fetch(asset.uri).then((res) => res.json());
      //   console.log("Updated Image URL", data["image"]);
      // } catch (error) {
      //   console.log("fetch metadata failed: ", error);
      // }
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
      <img
        src={imageUrl}
        alt="unrevealed"
        className="w-[200px] h-[200px] bg-white"
      />
      <button
        className="bg-yellow-500 p-1 text-gray-500 font-semibold text-[24px] text-center"
        onClick={() => handleClick()}
      >
        Reveal
      </button>
    </div>
  );
};

export default UnRevealedNFT;
