"use client";

import { useAtom } from "jotai";
import { useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, Keypair } from "@solana/web3.js";
import { openDlgAtom } from "@/atoms/openDlgAtom";
import {
  SERVER_ADDRESS,
  TOKEN_METADATA_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
  SPL_TOKEN_PROGRAM_ID,
  MINT_AUTHORITY,
  COLLECTION_MINT,
} from "@/config";
import {
  getMetadata,
  getMasterEdition,
  getAssociatedTokenAddress,
  getBalances,
} from "@/lib/solana";
import { useAnchor } from "@/hooks/useAnchor";

const BuyNFT = ({
  date,
  mintedNumber,
  totalSupply,
}: {
  date: string;
  mintedNumber: number;
  totalSupply: number;
}) => {
  const { publicKey } = useWallet();
  const { program } = useAnchor();
  const [_, setOpen] = useAtom(openDlgAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async () => {
    if (!publicKey) {
      setOpen(true);
      return;
    }
    console.log("Date: ", date);
    setIsLoading(true);
    try {
      const mintKeypair = Keypair.generate();
      const mint = mintKeypair.publicKey;

      const nft_uri =
        "https://ipfs.io/ipfs/bafkreiebgoqacrjm7omwjisjlv3djfc3fcb66glup3cxikc23zihcbmo34";
      const amount = 0.1 * LAMPORTS_PER_SOL;

      console.log("\nMint", mint.toBase58());

      const metadata = await getMetadata(mint);
      console.log("Metadata", metadata.toBase58());

      const masterEdition = await getMasterEdition(mint);
      console.log("Master Edition", masterEdition.toBase58());

      const destination = getAssociatedTokenAddress(mint, publicKey);
      console.log("Destination", destination.toBase58());

      const [checkRevealPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("minting_time"), mint.toBuffer()],
        program.programId
      );

      const tx = await program.methods
        .mintNft(nft_uri, new anchor.BN(amount))
        .accountsPartial({
          owner: publicKey,
          recipient: SERVER_ADDRESS,
          destination,
          metadata,
          masterEdition,
          mint,
          mintAuthority: MINT_AUTHORITY,
          collectionMint: COLLECTION_MINT,
          systemProgram: SYSTEM_PROGRAM_ID,
          tokenProgram: SPL_TOKEN_PROGRAM_ID,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        })
        .signers([mintKeypair])
        .rpc({
          skipPreflight: true,
        });
      console.log("NFT Mint Successs\n", tx);
      await getBalances("My Wallet", publicKey);
      await getBalances("Owner Wallet", SERVER_ADDRESS);
      const check_reveal = await program.account.checkRevealState.fetch(
        checkRevealPDA
      );
      console.log("Reveal is allow?: ", check_reveal.isAllow);
      console.log("Minting Time: ", check_reveal.timestamp);

      const collectionMetadata = await getMetadata(COLLECTION_MINT);
      console.log("Collection Metadata", collectionMetadata.toBase58());

      const collectionMasterEdition = await getMasterEdition(COLLECTION_MINT);
      console.log(
        "Collection Master Edition",
        collectionMasterEdition.toBase58()
      );
      const tx1 = await program.methods
        .verifyCollection()
        .accountsPartial({
          authority: publicKey,
          metadata,
          mint,
          mintAuthority: MINT_AUTHORITY,
          collectionMint: COLLECTION_MINT,
          collectionMetadata,
          collectionMasterEdition,
          systemProgram: SYSTEM_PROGRAM_ID,
          sysvarInstruction: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        })
        .rpc({
          skipPreflight: true,
        });
      console.log("Verify Collection Successs\n", tx1);
    } catch (error) {
      console.log("Failed to NFT mint!\n", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col justify-between w-[300px] border-[5px] border-black p-5 gap-3 text-center">
        <div className="flex flex-col">
          <p className="font-bold text-[30px]">{date}</p>
          <p className="text-[30px]">Swag Drop</p>
        </div>
        <div className="flex flex-col">
          <p className="font-semibold text-[24px]">Total Minted</p>
          <p className="text-[24px]">
            {mintedNumber}/{totalSupply}
          </p>
        </div>
        <button
          disabled={isLoading}
          className={`border-[5px] border-black bg-yellow-500 p-2 text-gray-500 font-semibold text-[24px]`}
          onClick={() => handleClick()}
        >
          BUY NOW
        </button>
      </div>
    </div>
  );
};

export default BuyNFT;
