import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  Metadata,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import { clusterApiUrl } from "@solana/web3.js";

export const getNFTMetadata = async (mint: string): Promise<Metadata> => {
  const umi = createUmi(clusterApiUrl("devnet"));
  umi.use(mplTokenMetadata());

  // The mint address of the NFT you want to fetch
  const mintAddress = publicKey(mint);

  console.log("Fetching NFT metadata...");
  const asset = await fetchDigitalAsset(umi, mintAddress);

  return asset.metadata;
};
