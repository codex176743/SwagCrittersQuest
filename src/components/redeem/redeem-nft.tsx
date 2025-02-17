"use client";

import { useState, useEffect } from "react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useAnchor } from "@/hooks/useAnchor";
import { useToast } from "@/hooks/use-toast";
import {
  SPL_TOKEN_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
} from "@/config/solana";
import NFTBox from "@/components/NFTBox";
import ShopifyDialog from "./shopify-dialog";

const RedeemNFT = ({ nft }: { nft: DigitalAssetWithToken }) => {
  const { publicKey } = useWallet();
  const { program } = useAnchor();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = async () => {
    console.log("Burn & Ship Clicked! Mint Address: ", nft.mint.publicKey);
    setOpen(true);

    // const mint = new PublicKey(nft.mint.publicKey);
    // console.log("\nMint", mint.toBase58());

    // const tokenAccount = getAssociatedTokenAddressSync(mint, publicKey);
    // console.log("TokenAccount", tokenAccount.toBase58());

    // try {
    //   const tx = await program.methods
    //     .burnNft()
    //     .accountsPartial({
    //       owner: publicKey,
    //       mint,
    //       tokenAccount,
    //       tokenProgram: SPL_TOKEN_PROGRAM_ID,
    //       tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    //       systemProgram: SYSTEM_PROGRAM_ID,
    //     })
    //     .rpc({
    //       skipPreflight: true,
    //     });
    //   console.log("\nNFT Burned! Your transaction signature", tx);

    //   toast({
    //     description: "Your NFT is burned!",
    //   });
    // } catch (error) {
    //   console.log("Failed to burn NFT:", error);
    //   toast({
    //     variant: "destructive",
    //     description: "Failed to burn NFT!",
    //   });
    // }
  };

  return (
    <div className="flex flex-col gap-1 items-center">
      <NFTBox nft={nft} />
      <button
        disabled={isLoading}
        className="bg-yellow-500 p-1 w-full text-gray-500 font-semibold text-[24px] text-center"
        onClick={() => handleClick()}
      >
        {isLoading ? "Redeeming..." : "Redeem"}
      </button>
      <ShopifyDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default RedeemNFT;
