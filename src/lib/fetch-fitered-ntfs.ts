import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";
import {
  fetchAllDigitalAssetWithTokenByOwner,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { clusterApiUrl } from "@solana/web3.js";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const fetchFiteredNFTs = async (
  collectionMint: string,
  type: string
) => {
  // Create a UMI instance
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

  const filtered_NFTs = allNFTs.filter(
    (nft) =>
      nft.metadata.collection.value.key == collectionMint &&
      nft.metadata.symbol == type
  );
  console.log(`\nFound ${filtered_NFTs.length} Unrevealed NFTs:`);
  // console.log(JSON.stringify(filtered_NFTs, null, 2));

  return filtered_NFTs;
};
