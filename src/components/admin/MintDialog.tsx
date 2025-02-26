"use client";

import { useState, ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, ImageUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as anchor from "@coral-xyz/anchor";
import {
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Keypair, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getMetadata, getMasterEdition } from "@/lib/get-pda-address";
import {
  MINT_AUTHORITY,
  OWNER_PUBLICKEY,
  SYSTEM_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
  SPL_TOKEN_PROGRAM_ID,
} from "@/config/solana";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFileUrl, getJsonUrl } from "@/lib/get-ipfs-url";
import { useToast } from "@/hooks/use-toast";
import { useAnchor } from "@/hooks/useAnchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { pinata } from "@/config/pinata";

const FormSchema = z.object({
  nft_name: z
    .string()
    .min(2, { message: "at the least 2 characters required" }),
  description: z.string().optional(),
  allow_day: z.date({
    required_error: "A Mint allow day is required.",
  }),
  delay_time: z.number().min(0).max(15),
  cost_amount: z.number().min(0),
  count_limit: z.number().min(0).max(2500),
});

const MintDialog = () => {
  const { program } = useAnchor();
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();

  const [imageUrl, setImageUrl] = useState<string>("");
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nft_name: "",
      description: "",
      allow_day: new Date(),
      delay_time: 7,
      cost_amount: 1,
      count_limit: 2500,
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!publicKey || !signTransaction) {
      return;
    }

    if (!imageUrl) {
      toast({
        variant: "destructive",
        description: "Please select an image",
      });

      return;
    }

    setIsLoading(true);

    try {
      // Pinata Client Side Setup
      // (if you need to enable larger uploads follow the client side setup)
      // const keyRequest = await fetch("/api/pinata/key");
      // const keyData = await keyRequest.json();
      // const upload = await pinata.upload.file(imageFile).key(keyData.JWT);
      // console.log(upload);

      // Pinata Server Side Setup
      const ipfsImageUrl = await getFileUrl(imageUrl);
      const name = data.nft_name;
      const symbol = "COLLECTION";
      const jsonData = {
        name: name,
        symbol,
        description: data.description,
        seller_fee_basis_points: 500,
        external_url: "https://swag.critters.quest",
        image: ipfsImageUrl,
        properties: {
          files: [
            {
              uri: ipfsImageUrl,
              type: "image/png",
            },
          ],
        },
        attributes: [],
      };
      const ipfsJsonUrl = await getJsonUrl(jsonData);
      const amount = data.cost_amount * LAMPORTS_PER_SOL;
      const allow_time = Math.floor(data.allow_day.getTime() / 1000);
      const delay_time = 86400 * data.delay_time;
      const collectionKeypair = Keypair.generate();
      const collectionMint = collectionKeypair.publicKey;
      console.log("\nCollection Mint Key: ", collectionMint.toBase58());
      const metadata = await getMetadata(collectionMint);
      console.log("Collection Metadata Account: ", metadata.toBase58());
      const masterEdition = await getMasterEdition(collectionMint);
      console.log(
        "Collection Master Edition Account: ",
        masterEdition.toBase58()
      );
      const destination = getAssociatedTokenAddressSync(
        collectionMint,
        OWNER_PUBLICKEY
      );
      console.log("Destination ATA: ", destination.toBase58());
      const transaction = new Transaction();
      transaction.add(
        await program.methods
          .createCollection(
            name,
            ipfsJsonUrl,
            new anchor.BN(amount),
            new anchor.BN(allow_time),
            new anchor.BN(delay_time),
            data.count_limit
          )
          .accountsPartial({
            user: OWNER_PUBLICKEY,
            mint: collectionMint,
            mintAuthority: MINT_AUTHORITY,
            metadata,
            masterEdition,
            destination,
            systemProgram: SYSTEM_PROGRAM_ID,
            tokenProgram: SPL_TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          })
          .signers([collectionKeypair])
          .transaction()
      );
      const recentBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = recentBlockhash.blockhash;
      transaction.feePayer = OWNER_PUBLICKEY;
      transaction.partialSign(collectionKeypair);
      try {
        const signedTransaction = await signTransaction(transaction);
        const tx = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );
        console.log("\nCollection NFT minted: TxID - ", tx);
        toast({
          description: "Collection NFT minted",
        });
        setOpen(false);
      } catch (err) {
        console.error("Failed to create collection NFT:", err);
        toast({
          variant: "destructive",
          description: "Failed to create collection NFT!",
        });
      }
    } catch (error) {
      console.log("Collection NFT Mint Error!", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-center">
          <button
            disabled={isloading}
            className="p-2 font-semibold bg-yellow-500 hover:bg-yellow-300"
          >
            Create a new Collection
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <DialogHeader>
              <DialogTitle>New Collection</DialogTitle>
              <DialogDescription>
                Please input a new collection NFT informations.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center items-center pb-5">
              <Label
                htmlFor="image"
                className="relative rounded-[20px] border overflow-hidden cursor-pointer"
              >
                <img
                  src={imageUrl ? imageUrl : "/images/unrevealed.jpg"}
                  className="h-[150px] w-[150px]"
                  alt="image"
                />
                <div className="absolute flex flex-col inset-0 items-center justify-center opacity-0 hover:opacity-60 bg-black">
                  <ImageUp className="h-16 w-16 text-white" />
                </div>
              </Label>
              <Input
                id="image"
                onChange={handleImageChange}
                type="file"
                className="hidden"
              />
            </div>
            <FormField
              control={form.control}
              name="nft_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Collection Name<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="February 2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="This is a collection..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-5">
              <FormField
                control={form.control}
                name="allow_day"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Allow Mint Day<span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          // disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="delay_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Delay Day(day)<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="7"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          // Convert the input value to a number
                          field.onChange(e.target.valueAsNumber);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row gap-5">
              <FormField
                control={form.control}
                name="cost_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Cost Amount(SOL)<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="3"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          // Convert the input value to a number
                          field.onChange(e.target.valueAsNumber);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="count_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mint Limit<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="2500"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          // Convert the input value to a number
                          field.onChange(e.target.valueAsNumber);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isloading} className="w-full">
              {isloading ? "Minting..." : "Mint"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MintDialog;
