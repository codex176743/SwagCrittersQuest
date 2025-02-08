import * as anchor from "@coral-xyz/anchor";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { TOKEN_METADATA_PROGRAM_ID } from "@/config";
import { connection } from "@/hooks/useAnchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const getMetadata = async (
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0];
};

export const getMasterEdition = async (
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from("edition"),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0];
};

export const getAssociatedTokenAddress = (
  mint: anchor.web3.PublicKey,
  pubKey: anchor.web3.PublicKey
): anchor.web3.PublicKey => {
  return getAssociatedTokenAddressSync(mint, pubKey);
};

export const getBalances = async (
  addressName: string,
  publicKey: anchor.web3.PublicKey
) => {
  const balance = await connection.getBalance(publicKey);
  console.log(`   Balance of ${addressName} => ${balance / LAMPORTS_PER_SOL}`);
};
