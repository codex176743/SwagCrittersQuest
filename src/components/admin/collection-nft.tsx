import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import NFTBox from "../NFTBox";

const CollectionMint = ({ nft }: { nft: DigitalAssetWithToken }) => {
  return <NFTBox nft={nft} />;
};

export default CollectionMint;
