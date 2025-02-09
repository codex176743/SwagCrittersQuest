"use client";

import * as anchor from "@coral-xyz/anchor";
import { PublicKey, clusterApiUrl, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";

export const SOLANA_RPC_URL = "https://api.devnet.solana.com";

export const NETWORK = clusterApiUrl("devnet");

export const PROGRAM_ID = new PublicKey(
  "FCB6y6NyGSfaFhhukF34YoAbw1kN7jktjX7VpsQWg68"
);

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const SYSTEM_PROGRAM_ID = SystemProgram.programId;

export const SPL_TOKEN_PROGRAM_ID = TOKEN_PROGRAM_ID;

export const SERVER_ADDRESS = new PublicKey(
  "own8NgaTWnixseSZyonfuAM3E6quZGmKtkLM8aBXrtE"
);

export const MINT_AUTHORITY = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("authority")],
  PROGRAM_ID
)[0];

export const COLLECTION_MINT = new PublicKey(
  "ATf288DYvVcB17hWkoZegCYEifVVjSjxk5Q13V9U4N1X"
);
