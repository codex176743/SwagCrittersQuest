import {
  Metadata,
  fetchDigitalAsset,
  mplTokenMetadata,
  fetchAllDigitalAssetWithTokenByOwner,
} from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey, publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl } from "@solana/web3.js";

export const getNFTMetadata = async (mint: PublicKey): Promise<Metadata> => {
  const umi = createUmi(clusterApiUrl("devnet"));
  umi.use(mplTokenMetadata());

  console.log("Fetching NFT metadata...");
  const asset = await fetchDigitalAsset(umi, mint);

  return asset.metadata;
};

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const fetchFiteredNFTs = async (
  collectionMint: string,
  type: string
) => {
  const umi = createUmi(clusterApiUrl("devnet"));
  umi.use(mplTokenMetadata());

  // The owner's public key
  const ownerPublicKey = publicKey(
    "9PqN6LKZf8aRfYibquh3TMr27GHuwTdQjwL11hKWScga"
  );

  console.log("Fetching NFTs...");
  const allNFTs = await fetchAllDigitalAssetWithTokenByOwner(
    umi,
    ownerPublicKey
  );

  console.log(`Found ${allNFTs.length} NFTs for the owner:`);
  // console.log(JSON.stringify(allNFTs, null, 2));

  const filtered_NFTs = allNFTs.filter(
    (nft) =>
      nft.metadata.collection.value.key == collectionMint &&
      nft.metadata.symbol == type
  );
  console.log(`\nFound ${filtered_NFTs.length} Unrevealed NFTs:`);
  // console.log(JSON.stringify(filtered_NFTs, null, 2));

  return filtered_NFTs;
};
