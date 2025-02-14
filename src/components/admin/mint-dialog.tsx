"use client";

import { useState, ChangeEvent } from "react";
import { ImageUp } from "lucide-react";
import {
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Keypair, Transaction } from "@solana/web3.js";
import { getMetadata, getMasterEdition } from "@/lib/get-pda-address";
import {
  MINT_AUTHORITY,
  OWNER_PUBLICKEY,
  SYSTEM_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
  SPL_TOKEN_PROGRAM_ID,
} from "@/config/solana";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFileUrl, getJsonUrl } from "@/lib/get-ipfs-url";
import { useToast } from "@/hooks/use-toast";
import { useAnchor } from "@/hooks/useAnchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { pinata } from "@/config/pinata";

const MintDialog = () => {
  const { program } = useAnchor();
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("/images/unrevealed.jpg");
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
    setError("");

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!publicKey || !signTransaction) {
      return;
    }

    if (!imageFile) {
      setError("Please input a collection image.");
      return;
    }

    setIsLoading(true);
    setOpen(false);

    try {
      // Pinata Client Side Setup
      // (if you need to enable larger uploads follow the client side setup)
      // const keyRequest = await fetch("/api/pinata/key");
      // const keyData = await keyRequest.json();
      // const upload = await pinata.upload.file(imageFile).key(keyData.JWT);
      // console.log(upload);

      // Pinata Server Side Setup
      const ipfsImageUrl = await getFileUrl(imageUrl);
      const symbol = "COLLECTION";
      const jsonData = {
        name,
        symbol,
        description,
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
      console.log(name, symbol, ipfsJsonUrl);
      const transaction = new Transaction();
      transaction.add(
        await program.methods
          .createCollection(name, symbol, ipfsJsonUrl)
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
            {isloading ? "Minting..." : "Create a new Collection"}
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Collection</DialogTitle>
          <DialogDescription>
            Please input a new collection NFT informations.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <div className="flex justify-center items-center pb-5">
          <Label
            htmlFor="image-file"
            className="relative rounded-[20px] border overflow-hidden cursor-pointer"
          >
            <img
              src={imageUrl}
              className="h-[150px] w-[150px]"
              alt="collection_image"
            />
            <div className="absolute flex flex-col inset-0 items-center justify-center opacity-0 hover:opacity-60 bg-black">
              <ImageUp className="h-16 w-16 text-white" />
            </div>
          </Label>
          <Input
            id="image-file"
            onChange={handleImageChange}
            type="file"
            required={true}
            className="hidden"
          />
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name<span className="text-red-600">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              placeholder="Input a NFT name..."
              maxLength={20}
              required={true}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              placeholder="Input a NFT description..."
              maxLength={50}
              required={true}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="py-5">
          <Button onClick={handleSubmit}>Mint</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MintDialog;
