"use client";

import React, { useEffect, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useAnchor } from "@/hooks/useAnchor";
import { useToast } from "@/hooks/use-toast";
import { getProducts, createOrder } from "@/lib/shopify-api";
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
  ERROR = "ERROR",
}

const ShopifyDialog = ({
  nft,
  open,
  setOpen,
  variantID,
  setVariantID,
}: {
  nft: DigitalAssetWithToken;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  variantID: string | undefined;
  setVariantID: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const { publicKey } = useWallet();
  const { program } = useAnchor();
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressType>();
  const [productInfo, setProductInfo] = useState<any>();
  const [nextPage, setNextPage] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  if (!publicKey) {
    return;
  }

  useEffect(() => {
    const fetchProductInfo = async () => {
      const [RevealPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("reveal_state"),
          new PublicKey(nft.mint.publicKey).toBuffer(),
        ],
        program.programId
      );
      const revealState = await program.account.revealState.fetch(RevealPDA);
      const product = await getProducts(revealState.productId);
      setProductInfo(product);
    };

    fetchProductInfo();
  }, [nft]);

  const handleSubmit = async () => {
    if (!shippingAddress) {
      toast({
        variant: "destructive",
        description: "Please fill shipping address!",
      });
      return;
    }

    if (!variantID) {
      toast({
        variant: "destructive",
        description: "Please select one variant!",
      });
      return;
    }

    // Burn NFT
    if (status == Status.IDLE) {
      setStatus(Status.CREATING);
      const mint = new PublicKey(nft.mint.publicKey);
      const tokenAccount = getAssociatedTokenAddressSync(mint, publicKey);
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
      setStatus(Status.IDLE);
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
              {status == Status.ERROR && "ERROR. TRY AGAIN!"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShopifyDialog;
