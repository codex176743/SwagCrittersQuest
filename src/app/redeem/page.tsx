import RedeemNFT from "@/components/redeem/redeem-nft";
import { fetchFiteredNFTs } from "@/lib/get-nft";

const RedeemPage = async () => {
  const collectionMint = "ATf288DYvVcB17hWkoZegCYEifVVjSjxk5Q13V9U4N1X";
  const nfts = await fetchFiteredNFTs(collectionMint, "UPDATED");

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
