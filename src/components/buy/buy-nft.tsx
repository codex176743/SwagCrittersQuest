"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, Keypair, Transaction } from "@solana/web3.js";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import { ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { openDlgAtom } from "@/atoms/openDlgAtom";
import {
  OWNER_PUBLICKEY,
  TOKEN_METADATA_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
  SPL_TOKEN_PROGRAM_ID,
  MINT_AUTHORITY,
  PROGRAM_ID,
} from "@/config/solana";
import {
  getMetadata,
  getMasterEdition,
  getAssociatedTokenAddress,
} from "@/lib/get-pda-address";
import { useAnchor } from "@/hooks/useAnchor";
import Loading from "./loading";
import { useToast } from "@/hooks/use-toast";
import { getJsonUrl } from "@/lib/get-ipfs-url";

const BuyNFT = ({ nft }: { nft: DigitalAssetWithToken }) => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { program } = useAnchor();
  const { toast } = useToast();
  const [_, setOpen] = useAtom(openDlgAtom);
  const [mintedNumber, setMintedNumber] = useState<number>(0);
  const [totalNumber, setTotalNumber] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
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
    };

    fetchCollectionState();
  }, []);

  const handleClick = async () => {
    if (!publicKey || !signTransaction) {
      setOpen(true);
      return;
    }

    setIsLoading(true);

    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;
    console.log("\nMint", mint.toBase58());

    const nft_name = nft.metadata.name + " #" + (mintedNumber + 1);
    const response = await fetch(nft.metadata.uri);
    const data = await response.json();
    const jsonData = {
      name: nft_name,
      symbol: "BLACKBOX",
      description: "This is a Blackbox NFT.",
      image: data.image,
      external_url: "https://swag.critters.quest",
      attributes: [
        {
          trait_type: "Status",
          value: "Unevealed",
        },
      ],
    };

    const ipfsJsonUrl = await getJsonUrl(jsonData);
    const collection_mint = new anchor.web3.PublicKey(nft.mint.publicKey);
    const metadata = await getMetadata(mint);
    console.log("Metadata", metadata.toBase58());

    const masterEdition = await getMasterEdition(mint);
    console.log("Master Edition", masterEdition.toBase58());

    const destination = getAssociatedTokenAddress(mint, publicKey);
    console.log("Destination", destination.toBase58());

    const transaction = new Transaction();

    transaction.add(
      await program.methods
        .mintNft(nft_name, ipfsJsonUrl)
        .accountsPartial({
          owner: publicKey,
          recipient: OWNER_PUBLICKEY,
          mint,
          destination,
          metadata,
          masterEdition,
          mintAuthority: MINT_AUTHORITY,
          collectionMint: collection_mint,
          systemProgram: SYSTEM_PROGRAM_ID,
          tokenProgram: SPL_TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        })
        .signers([mintKeypair])
        .transaction()
    );

    const collectionMetadata = await getMetadata(collection_mint);
    console.log("Collection Metadata", collectionMetadata.toBase58());

    const collectionMasterEdition = await getMasterEdition(collection_mint);
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
          collectionMint: collection_mint,
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
        <div className="flex flex-col justify-between w-[350px] border-[5px] border-black p-5 gap-3 text-center">
          <div className="flex flex-col">
            <p className="font-bold text-[40px]">{nft.metadata.name}</p>
            <p className="text-[40px]">Swag Drop</p>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-[35px]">Total Minted</p>
            <p className="text-[24px]">
              {mintedNumber}/{totalNumber}
            </p>
          </div>
          <button
            disabled={isLoading}
            className={`border-[5px] border-black bg-yellow-500 p-2 text-gray-500 font-semibold text-[30px]`}
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
