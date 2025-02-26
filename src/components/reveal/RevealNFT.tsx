"use client";

import { useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { getMetadata } from "@/lib/get-pda-address";
import { useAnchor } from "@/hooks/useAnchor";
import {
  MINT_AUTHORITY,
  SYSTEM_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
} from "@/config/solana";
import { useToast } from "@/hooks/use-toast";
import NFTDialog from "./NFTDialog";
import NFTBox from "@/components/NFTBox";
import { getShopifyID, getProducts } from "@/lib/shopify-api";
import { getFileUrl, getJsonUrl } from "@/lib/get-ipfs-url";

const RevealNFT = ({ nft }: { nft: DigitalAssetWithToken }) => {
  const { publicKey } = useWallet();
  const { program } = useAnchor();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = async () => {
    if (!publicKey) {
      return;
    }

    setIsLoading(true);

    try {
      const collectionKey =
        nft.metadata.collection.__option === "Some" && // Check if the Option is Some
        nft.metadata.collection.value.key; // Access the value if it exists
      const collection_mint = new PublicKey(collectionKey);

      const [RevealPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("reveal_state"),
          new PublicKey(nft.mint.publicKey).toBuffer(),
        ],
        program.programId
      );
      const revealState = await program.account.revealState.fetch(RevealPDA);

      const [collectionPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("collection_state"), collection_mint.toBuffer()],
        program.programId
      );
      const collectionState = await program.account.collectionState.fetch(
        collectionPDA
      );

      const currentTime = Math.floor(new Date().getTime() / 1000);
      const mintTime = revealState.mintTime.toNumber();
      const allowTime = collectionState.allowTime.toNumber();
      const delayTime = collectionState.delayTime.toNumber() - 43200;

      if (currentTime < allowTime || currentTime < mintTime + delayTime) {
        toast({
          variant: "destructive",
          description: "Reveal Time is not reached yet!",
        });
        setIsLoading(false);
        return;
      }

      // const [collectionName, nftID] = nft.metadata.name.split("#");
      const collectionName = nft.metadata.name;
      const nftID = revealState.nftId.toString();
      const shopify_Id = await getShopifyID(
        collectionName.trim(),
        nftID.trim()
      );

      const product = await getProducts(shopify_Id);
      const nft_name = product["title"];
      const ipfsImageUrl = await getFileUrl(product["image"]["src"]);
      setName(product["title"]);
      setImageUrl(product["image"]["src"]);

      const jsonData = {
        name: nft_name,
        symbol: "SWAGBOX",
        description: "This is a Revealed Swag Box.",
        image: ipfsImageUrl,
        external_url: "https://swag.critters.quest",
        attributes: [
          {
            trait_type: "Status",
            value: "Revealed",
          },
        ],
      };
      const ipfsJsonUrl = await getJsonUrl(jsonData);

      const mintAddress = new PublicKey(nft.mint.publicKey);
      const mintMetadata = await getMetadata(mintAddress);

      try {
        const tx = await program.methods
          .revealNft(nft_name, ipfsJsonUrl, shopify_Id)
          .accountsPartial({
            owner: publicKey,
            mint: mintAddress,
            metadata: mintMetadata,
            updateAuthority: MINT_AUTHORITY,
            collectionMint: collection_mint,
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
      }
    } catch (error) {
      console.log("Revealing NFT Failed!", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 items-center">
      <NFTBox nft={nft} />
      <button
        disabled={isLoading}
        className="bg-yellow-500 px-5 py-1 text-gray-500 font-semibold text-[24px] text-center"
        onClick={() => handleClick()}
      >
        {isLoading ? "Revealing..." : "Reveal"}
      </button>
      <NFTDialog
        name={name}
        imageUrl={imageUrl}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};

export default RevealNFT;
