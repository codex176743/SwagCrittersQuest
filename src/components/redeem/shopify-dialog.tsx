"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { ArrowRight } from "lucide-react";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useAnchor } from "@/hooks/useAnchor";
import { useToast } from "@/hooks/use-toast";
import {
  SPL_TOKEN_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
} from "@/config/solana";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CountrySelect from "@/components/ui/country-select";
import RegionSelect from "@/components/ui/region-select";
import { PhoneInput } from "@/components/ui/phone-input";
import { Separator } from "@/components/ui/separator";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  country: z.string({
    required_error: "Please select a country",
  }),
  address: z.string().min(1, { message: "Address is required" }),
  address_2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(1, { message: "ZipCode is required" }),
  phoneNumber: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [country, setCountry] = useState("US");
  const [data, setData] = useState<z.infer<typeof FormSchema>>();
  const [nextPage, setNextPage] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      country: "US",
      address: "",
      address_2: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "+1",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    // const mint = new PublicKey(nft.mint.publicKey);
    // console.log("\nMint", mint.toBase58());
    // const tokenAccount = getAssociatedTokenAddressSync(mint, publicKey);
    // console.log("TokenAccount", tokenAccount.toBase58());
    // try {
    //   const tx = await program.methods
    //     .burnNft()
    //     .accountsPartial({
    //       owner: publicKey,
    //       mint,
    //       tokenAccount,
    //       tokenProgram: SPL_TOKEN_PROGRAM_ID,
    //       tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    //       systemProgram: SYSTEM_PROGRAM_ID,
    //     })
    //     .rpc({
    //       skipPreflight: true,
    //     });
    //   console.log("\nNFT Burned! Your transaction signature", tx);
    //   toast({
    //     description: "Your NFT is burned!",
    //   });
    // } catch (error) {
    //   console.log("Failed to burn NFT:", error);
    //   toast({
    //     variant: "destructive",
    //     description: "Failed to burn NFT!",
    //   });
    // }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!nextPage ? (
        <DialogContent className="sm:max-w-[500px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                (data: z.infer<typeof FormSchema>) => {
                  setData(data);
                  setNextPage(true);
                }
              )}
              className="space-y-3"
            >
              <DialogHeader>
                <DialogTitle>Shipping Address</DialogTitle>
                <DialogDescription>
                  Before redeeming your products, please set your shipping
                  address.
                </DialogDescription>
              </DialogHeader>
              <Separator />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First Name<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last Name<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Country<span className="text-red-500">*</span>
                    </FormLabel>
                    <CountrySelect
                      placeholder="Please select a country"
                      onChange={(country) => {
                        field.onChange(country);
                        setCountry(country);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Address<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address_2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apartment, suite, etc. (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-9 gap-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>
                        City<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>
                        State/Region<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <RegionSelect
                          placeholder="State / Region"
                          countryCode={country}
                          onChange={(value) => field.onChange(value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>
                        Zip/Postcode<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Zip / Postcode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="text-left">Phone Number</FormLabel>
                    <FormControl className="w-full">
                      <PhoneInput
                        placeholder="Enter a phone number"
                        international
                        defaultCountry="US"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-left">
                      Phone number used for shipping contact
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />
              <Button type="submit" className="w-full">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </Form>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>REDEEM</DialogTitle>
            <DialogDescription>
              Confirm your product + shipping address.
            </DialogDescription>
          </DialogHeader>
          <Separator />
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ShopifyDialog;
