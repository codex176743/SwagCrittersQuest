import RedeemNFT from "@/components/redeem/redeem-nft";
import { fetchFiteredNFTs } from "@/lib/get-nft";

const RedeemPage = async () => {
  const collectionMint = "FHyJRmiJqUzLzQtjdy96SUR7KKp5jvWFKVyJkCXZeMy9";
  const nfts = await fetchFiteredNFTs(collectionMint, "");

  return (
    <div className="container mx-auto">
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-10 p-10 rounded-[50px] bg-black items-center">
        {nfts.map((nft, index) => (
          <RedeemNFT key={index} nft={nft} />
        ))}
      </div>
    </div>
  );
};

export default RedeemPage;
