import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import { SOLANA_RPC_URL } from "@/config";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useWallet } from "@solana/wallet-adapter-react";
import { burnV1, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";

export const burnNFT = async () => {
  const wallet = useWallet();
  const umi = createUmi(SOLANA_RPC_URL)
    .use(walletAdapterIdentity(wallet))
    .use(mplTokenMetadata());

  const mint = publicKey("4koig16CtAD2E6EPevzAbjzpGnnZDsaRZMjZe5XRE4CX");

  try {
    await burnV1(umi, {
      mint,
      authority: umi.identity,
      tokenOwner: umi.identity.publicKey,
      tokenStandard: TokenStandard.NonFungible,
    }).sendAndConfirm(umi);
  } catch (error) {
    console.log("burn nft:", error);
  }
};
