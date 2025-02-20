"use client";

import React, { useEffect, useState } from "react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useAnchor } from "@/hooks/useAnchor";
import { useToast } from "@/hooks/use-toast";
import { getShopifyID, getProducts, createOrder } from "@/lib/shopify-api";
import {
  SPL_TOKEN_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
} from "@/config/solana";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import type { ShippingAddressType } from "@/types/shipping-address";
import ShippingAddressCotent from "./ShippingAddressContent";
import RedeemProductContent from "./RedeemProductContent";

enum Status {
  IDLE = "IDLE",
  CREATING = "CREATING TRANSACTION",
  WAITING = "WAITING FOR CONFIRMATION",
  CONFIRMED = "TRANSACTION CONFIRMED",
  ORDERING = "CREATING ORDER",
  SUCCESS = "ORDER CREATED",
  ERROR = "ERROR",
}

const ShopifyDialog = ({
  nft,
  open,
  setOpen,
}: {
  nft: DigitalAssetWithToken;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { publicKey } = useWallet();
  const { program } = useAnchor();
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [variantID, setVariantID] = useState<string>("");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressType>();
  const [productInfo, setProductInfo] = useState<any>();
  const [nextPage, setNextPage] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  if (!publicKey) {
    return;
  }

  useEffect(() => {
    const fetchProductInfo = async () => {
      const [collectionName, nftID] = nft.metadata.name.split("#");
      const shopify_Id = await getShopifyID(
        collectionName.trim(),
        nftID.trim()
      );
      const product = await getProducts(shopify_Id);
      setProductInfo(product);
    };

    fetchProductInfo();
  }, []);

  const handleSubmit = async () => {
    if (!shippingAddress || !variantID) {
      return;
    }

    // Burn NFT
    if (status == Status.IDLE) {
      setStatus(Status.CREATING);
      const mint = new PublicKey(nft.mint.publicKey);
      console.log("\nMint", mint.toBase58());
      const tokenAccount = getAssociatedTokenAddressSync(mint, publicKey);
      console.log("TokenAccount", tokenAccount.toBase58());
      try {
        setStatus(Status.WAITING);
        const tx = await program.methods
          .burnNft()
          .accountsPartial({
            owner: publicKey,
            mint,
            tokenAccount,
            tokenProgram: SPL_TOKEN_PROGRAM_ID,
            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
            systemProgram: SYSTEM_PROGRAM_ID,
          })
          .rpc({
            skipPreflight: true,
          });
        setStatus(Status.CONFIRMED);
        console.log("\nNFT Burned! Your transaction signature", tx);
      } catch (error) {
        console.log("Failed to burn NFT:", error);
        setStatus(Status.IDLE);
        toast({
          variant: "destructive",
          description: "Failed to burn NFT!",
        });
        return;
      }
    }

    // Create Order
    try {
      setStatus(Status.ORDERING);
      const order = await createOrder(variantID, shippingAddress);
      console.log("Order created", order);
      toast({
        description: "Order created!",
      });
      setStatus(Status.SUCCESS);
      setOpen(false);
    } catch (error) {
      console.log("Failed to create order:", error);
      setStatus(Status.ERROR);
      toast({
        variant: "destructive",
        description: "Failed to create order!",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        {!nextPage ? (
          <ShippingAddressCotent
            setShippingAddress={setShippingAddress}
            setNextPage={setNextPage}
          />
        ) : (
          <>
            <RedeemProductContent
              productInfo={productInfo}
              setVariantID={setVariantID}
            />
            <Separator />
            <DialogTitle>SHIPPING ADDRESS</DialogTitle>
            <div className="flex flex-row">
              <div className="flex flex-col basis-2/3">
                <p>
                  {shippingAddress?.firstName} {shippingAddress?.lastName}
                </p>
                <p>{shippingAddress?.address}</p>
                <p>
                  {shippingAddress?.city}, {shippingAddress?.state}{" "}
                  {shippingAddress?.zipCode}
                </p>
                <p>{shippingAddress?.country}</p>
                <p>Phone: {shippingAddress?.phoneNumber}</p>
              </div>
              <div className="flex flex-col basis-1/3 items-center justify-end">
                <Button
                  variant={"ghost"}
                  className="p-2 border rounded-md text-[15px] font-semibold"
                  onClick={() => setNextPage(false)}
                >
                  CHANGE ADDRESS
                </Button>
              </div>
            </div>
            <Separator />
            <div className="items-top flex space-x-2">
              <Checkbox
                id="terms"
                checked={isAccepted}
                onCheckedChange={(checked) => setIsAccepted(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree the Terms of Service and Privacy Policy
                </label>
              </div>
            </div>
            <DialogDescription>
              To complete your redemption, your product NFT will be burned. Then
              your product order will be processed and shipped.
            </DialogDescription>
            <Button
              disabled={
                !isAccepted || (status != Status.IDLE && status != Status.ERROR)
              }
              className="w-full"
              onClick={handleSubmit}
            >
              {status == Status.IDLE && "BURN & REDEEM PRODUCTS"}
              {status == Status.CREATING && "CREATING TRANSACTION"}
              {status == Status.WAITING && "WAITING FOR CONFIRMATION"}
              {status == Status.CONFIRMED && "CONFIRMED"}
              {status == Status.ORDERING && "CREATING ORDER"}
              {status == Status.SUCCESS && "ORDER CREATED"}
              {status == Status.ERROR && "ERROR. TRY AGAIN!"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShopifyDialog;
