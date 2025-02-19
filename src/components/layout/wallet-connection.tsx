"use client";

import { useAtom } from "jotai";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { walletConnected } from "@/atoms/walletConnectedAtom";

const WalletConnection = () => {
  const { select, wallets, publicKey, disconnect } = useWallet();
  const [open, setOpen] = useAtom(walletConnected);

  const handleWalletSelect = async (walletName: any) => {
    if (walletName) {
      try {
        select(walletName);
        setOpen(false);
      } catch (error) {
        console.log("wallet connection error: ", error);
      }
    }
  };

  const handleDisconnect = async () => {
    disconnect();
    setOpen(false);
  };

  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {!publicKey ? (
            <button className="flex flex-col p-1 border-[3px] border-black rounded-md bg-yellow-500 items-center">
              <Wallet fill="black" />
              <span className="text-[10px] font-semibold">CONNECT</span>
            </button>
          ) : (
            <button className="flex flex-col p-1 border-[3px] border-black rounded-md bg-yellow-500 items-center">
              <Wallet fill="black" />
              <span className=" truncate w-[50px] text-[10px] font-semibold">
                {publicKey.toBase58()}
              </span>
            </button>
          )}
        </DialogTrigger>
        <DialogContent
          className="max-w-[400px] border-[4px] border-yellow-500"
          style={{ borderRadius: "20px" }}
        >
          {!publicKey ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  <span className="border border-black p-1 text-[12px] font-semibold">
                    LINK A WALLET
                  </span>
                </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="flex flex-col w-full space-y-5 overflow-y-auto">
                {wallets.map((wallet) => (
                  <Button
                    key={wallet.adapter.name}
                    //onClick={() => select(wallet.adapter.name)}
                    onClick={() => handleWalletSelect(wallet.adapter.name)}
                    variant="default"
                    className="flex w-full h-[40px] text-[20px] justify-start"
                  >
                    <Image
                      src={wallet.adapter.icon}
                      alt={wallet.adapter.name}
                      height={24}
                      width={24}
                      className="mr-5"
                    />
                    <span className="text-[15px]">{wallet.adapter.name}</span>
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>
                  <span className="border border-black p-1 text-[12px] font-semibold">
                    DISCONNECT WALLET
                  </span>
                </DialogTitle>
                <DialogDescription className="text-center text-[20px] font-semibold">
                  Please Confirm...
                </DialogDescription>
              </DialogHeader>
              <Button
                variant="normal"
                className="flex w-full h-[60px] text-[20px]"
                onClick={() => handleDisconnect()}
              >
                DISCONNECT WALLET
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletConnection;
