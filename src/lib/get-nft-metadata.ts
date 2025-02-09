import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  generateSigner,
  signerIdentity,
} from "@metaplex-foundation/umi";
import {
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
// import { PublicKey } from "@metaplex-foundation/js";
import { SOLANA_RPC_URL } from "@/config";

export const getNFTMetadata = async () => {
  try {
    // Create a UMI instance
    const umi = createUmi(SOLANA_RPC_URL);

    // Use the mplTokenMetadata plugin
    umi.use(mplTokenMetadata());

    // Generate a new keypair (you can replace this with your own keypair if needed)
    // const keypair = generateSigner(umi);
    // umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

    // The mint address of the NFT you want to fetch
    const mintAddress = publicKey(
      "Hcpy46jvpeDQs6C415nqDFvhBBTkFqW5vTEv1bDRaMK6"
    );

    console.log("Fetching NFT metadata...");
    const asset = await fetchDigitalAsset(umi, mintAddress);

    console.log("NFT Metadata:");

    // If you want to access specific metadata fields:
    console.log("\nName:", asset.metadata.name);
    console.log("Symbol:", asset.metadata.symbol);
    console.log("URI:", asset.metadata.uri);

    // Fetch and log the JSON metadata
    if (asset.metadata.uri) {
      const response = await fetch(asset.metadata.uri);
      const jsonMetadata = await response.json();
      console.log("\nJSON Metadata:");
      console.log(JSON.stringify(jsonMetadata, null, 2));
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
