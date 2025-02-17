import { NextResponse, NextRequest } from "next/server";
import {
  mplTokenMetadata,
  fetchAllDigitalAssetWithTokenByOwner,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl } from "@solana/web3.js";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const publickey = searchParams.get("publickey");

  if (!publickey) {
    return NextResponse.json({ error: "no publickey" }, { status: 500 });
  }

  const umi = createUmi(clusterApiUrl("devnet"));
  umi.use(mplTokenMetadata());

  // The owner's public key
  const ownerPublicKey = publicKey(publickey);

  console.log("Fetching NFTs...");
  const allNFTs = await fetchAllDigitalAssetWithTokenByOwner(
    umi,
    ownerPublicKey
  );

  return NextResponse.json(allNFTs, { status: 200 });
}
