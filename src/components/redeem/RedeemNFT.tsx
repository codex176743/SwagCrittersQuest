"use client";

import { useState } from "react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import NFTBox from "@/components/NFTBox";
import ShopifyDialog from "./ShopifyDialog";

const RedeemNFT = ({ nft }: { nft: DigitalAssetWithToken }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [variantID, setVariantID] = useState<string | undefined>();

  return (
    <div className="flex flex-col gap-1 items-center">
      <NFTBox nft={nft} />
      <button
        className="bg-yellow-500 px-5 py-1 text-gray-500 font-semibold text-[24px] text-center"
        onClick={() => {
          setOpen(true);
          setVariantID(undefined);
        }}
      >
        Redeem
      </button>
      <ShopifyDialog
        nft={nft}
        open={open}
        setOpen={setOpen}
        variantID={variantID}
        setVariantID={setVariantID}
      />
    </div>
  );
};

export default RedeemNFT;
