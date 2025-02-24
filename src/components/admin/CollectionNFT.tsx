"use client";

import { useState } from "react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import NFTBox from "@/components/NFTBox";
import CollectionDialog from "./CollectionDialog";

const CollectionNFT = ({ nft }: { nft: DigitalAssetWithToken }) => {
  const [isDetail, setIsDetail] = useState<boolean>(false);

  return (
    <>
      <NFTBox nft={nft} setIsDetail={setIsDetail} />
      <CollectionDialog nft={nft} open={isDetail} setOpen={setIsDetail} />
    </>
  );
};

export default CollectionNFT;
