import RevealNFT from "@/components/reveal/reveal-nft";
import Roulette from "@/components/reveal/roulette";
import { fetchFiteredNFTs } from "@/lib/get-nft";

const RevealPage = async () => {
  const collectionMint = "FHyJRmiJqUzLzQtjdy96SUR7KKp5jvWFKVyJkCXZeMy9";
  const nfts = await fetchFiteredNFTs(collectionMint, "BLACKBOX");
  return (
    <div className="flex flex-col container mx-auto gap-10">
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-10 p-10 rounded-[50px] bg-black items-center">
        {nfts.map((nft, index) => (
          <RevealNFT key={index} nft={nft} />
        ))}
      </div>
      <Roulette />
    </div>
  );
};

export default RevealPage;
