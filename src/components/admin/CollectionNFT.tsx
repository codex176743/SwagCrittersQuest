"use client";

import { useState } from "react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import NFTBox from "@/components/NFTBox";
import CollectionDialog from "./CollectionDialog";

const CollectionNFT = ({ nft }: { nft: DigitalAssetWithToken }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <NFTBox nft={nft} setOpen={setOpen} />
      <CollectionDialog nft={nft} open={open} setOpen={setOpen} />
    </>
  );
};

export default CollectionNFT;
