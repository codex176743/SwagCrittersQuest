import * as anchor from "@coral-xyz/anchor";
import { PublicKey, clusterApiUrl, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const SOLANA_RPC_URL = "https://api.devnet.solana.com";

export const NETWORK = clusterApiUrl("devnet");

export const PROGRAM_ID = new PublicKey(
  "3orYKxtvWmb9QS58fzr4G1FGr6pygKCVbGdVQweHr6Q9"
);

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const SYSTEM_PROGRAM_ID = SystemProgram.programId;

export const SPL_TOKEN_PROGRAM_ID = TOKEN_PROGRAM_ID;

export const MINT_AUTHORITY = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("authority")],
  PROGRAM_ID
)[0];

export const OWNER_PUBLICKEY = new PublicKey(
  "9PqN6LKZf8aRfYibquh3TMr27GHuwTdQjwL11hKWScga"
);
