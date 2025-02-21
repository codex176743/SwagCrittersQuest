import { NextResponse, NextRequest } from "next/server";
import {
  mplTokenMetadata,
  fetchAllDigitalAssetWithTokenByOwner,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl } from "@solana/web3.js";

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

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

  const monthOrder = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  allNFTs.sort((a, b) => {
    const [monthA, yearA] = a.metadata.name.split(" ");
    const [monthB, yearB] = b.metadata.name.split(" ");

    if (yearA !== yearB) {
      return parseInt(yearA) - parseInt(yearB);
    }

    return (
      monthOrder[monthA as keyof typeof monthOrder] -
      monthOrder[monthB as keyof typeof monthOrder]
    );
  });

  return NextResponse.json(allNFTs, { status: 200 });
}
