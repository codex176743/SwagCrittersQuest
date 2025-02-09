import UnRevealedNFT from "@/components/reveal/unrevealed-nft";
import Roulette from "@/components/reveal/roulette";
import { fetchFiteredNFTs } from "@/lib/fetch-fitered-ntfs";

const RevealPage = async () => {
  const collectionMint = "ATf288DYvVcB17hWkoZegCYEifVVjSjxk5Q13V9U4N1X";
  const nfts = await fetchFiteredNFTs(collectionMint, "BLACKBOX");
  return (
    <div className="flex flex-col container mx-auto gap-10">
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-10 p-10 rounded-[50px] bg-black items-center">
        {nfts.map((nft, index) => (
          <UnRevealedNFT key={index} nft={nft} />
        ))}
      </div>
      <Roulette />
    </div>
  );
};

export default RevealPage;
