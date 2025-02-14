"use client";

import { useAtom } from "jotai";
import { useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, Keypair, Transaction } from "@solana/web3.js";
import { openDlgAtom } from "@/atoms/openDlgAtom";
import {
  OWNER_PUBLICKEY,
  TOKEN_METADATA_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
  SPL_TOKEN_PROGRAM_ID,
  MINT_AUTHORITY,
} from "@/config/solana";
import {
  getMetadata,
  getMasterEdition,
  getAssociatedTokenAddress,
} from "@/lib/get-pda-address";
import { useAnchor } from "@/hooks/useAnchor";
import Loading from "./loading";
import { useToast } from "@/hooks/use-toast";

const BuyNFT = ({
  date,
  mintedNumber,
  totalSupply,
}: {
  date: string;
  mintedNumber: number;
  totalSupply: number;
}) => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { program } = useAnchor();
  const { toast } = useToast();
  const [_, setOpen] = useAtom(openDlgAtom);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async () => {
    if (!publicKey || !signTransaction) {
      setOpen(true);
      return;
    }
    console.log("Date: ", date);
    setIsLoading(true);

    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
    console.log("\nMint", mint.toBase58());

    const nft_name = "CrittersNFT";

    const nft_uri =
      "https://ipfs.io/ipfs/bafkreiau6cv5uedxy24kug7k4cf4yeluvnszmvyaboemlu4g6eyw7j63jm";

    const real_uri =
      "https://ipfs.io/ipfs/bafkreigrgg7tmm4kjmkcf37vtlpslsawe7x4d27bsxxh2ykz4b4gkczkou";

    const amount = 0.1 * LAMPORTS_PER_SOL;

    const metadata = await getMetadata(mint);
    console.log("Metadata", metadata.toBase58());

    const masterEdition = await getMasterEdition(mint);
    console.log("Master Edition", masterEdition.toBase58());

    const destination = getAssociatedTokenAddress(mint, publicKey);
    console.log("Destination", destination.toBase58());

    const transaction = new Transaction();

    transaction.add(
      await program.methods
        .mintNft(nft_name, nft_uri, real_uri, new anchor.BN(amount))
        .accountsPartial({
          owner: publicKey,
          recipient: OWNER_PUBLICKEY,
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
        .transaction()
    );

    const collectionMetadata = await getMetadata(COLLECTION_MINT);
    console.log("Collection Metadata", collectionMetadata.toBase58());

    const collectionMasterEdition = await getMasterEdition(COLLECTION_MINT);
    console.log(
      "Collection Master Edition",
      collectionMasterEdition.toBase58()
    );
    transaction.add(
      await program.methods
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
        .transaction()
    );

    const recentBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = recentBlockhash.blockhash;
    transaction.feePayer = publicKey;
    transaction.partialSign(mintKeypair);
    try {
      const signedTransaction = await signTransaction(transaction);
      const transactionSignature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      console.log("NFT Mint Success!", transactionSignature);

      toast({
        description: "NFT Mint Success!",
      });
    } catch (error) {
      console.log("Failed to NFT mint!\n", error);
      toast({
        variant: "destructive",
        description: "Failed to NFT mint!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      {isLoading ? (
        <Loading />
      ) : (
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
      )}
    </div>
  );
};

export default BuyNFT;
