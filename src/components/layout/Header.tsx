"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import WalletConnection from "./WalletConnection";
import { OWNER_PUBLICKEY } from "@/config/solana";
import { useWallet } from "@solana/wallet-adapter-react";

const links = [
  {
    title: "Home",
    path: "/home",
  },
  {
    title: "Buy",
    path: "/buy",
  },
  {
    title: "Reveal",
    path: "/reveal",
  },
  {
    title: "Redeem",
    path: "/redeem",
  },
];

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const Header = () => {
  const pathname = usePathname();
  const { publicKey } = useWallet();

  return (
    <div className="flex flex-col container mx-auto space-y-10 mb-10">
      <header className="flex justify-around gap-5 items-center h-[70px]">
        <Link href="/home">
          <img src="/images/logo.png" alt="Logo" width={120} />
        </Link>
        <div className="hidden md:flex flex-row gap-10 bg-yellow-800 h-full items-center p-5">
          {publicKey?.toString() == OWNER_PUBLICKEY.toString() && (
            <div className="text-[24px] text-white font-semibold">
              <Link
                className={
                  pathname.startsWith("/admin") ? "active underline" : ""
                }
                href={"/admin"}
              >
                Admin
              </Link>
            </div>
          )}
          {links.map(({ title, path }) => (
            <div key={title} className="text-[24px] text-white font-semibold">
              <Link
                className={pathname.startsWith(path) ? "active underline" : ""}
                href={path}
              >
                {title}
              </Link>
            </div>
          ))}
        </div>
        <div className="flex flex-row justify-between space-x-10">
          <WalletConnection />
          <WalletMultiButtonDynamic className="btn-ghost btn-sm relative flex md:hidden text-lg " />
          <button className="px-10 bg-yellow-800 text-[20px] text-white font-semibold">
            SWAG STORE
          </button>
        </div>
      </header>
      <BackGroundImages />
    </div>
  );
};

const BackGroundImages = () => {
  return (
    <div className="flex flex-row justify-center">
      <div className="flex flex-col justify-end translate-x-16">
        <img src="/images/left-critters.png" alt="left critters" />
      </div>
      <div className="flex flex-col items-center">
        <img
          src="/images/quest-bound-nfts.png"
          alt="quest bound nfts"
          width={300}
          height={250}
        />
        <img
          src="/images/chest-road.png"
          alt="chest road"
          className="translate-x-10"
        />
      </div>
      <div className="flex flex-col justify-end -translate-x-16">
        <img src="/images/right-critters.png" alt="right critters" />
      </div>
    </div>
  );
};

export default Header;
