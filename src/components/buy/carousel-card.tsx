"use client";

import { useAtom } from "jotai";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { openDlgAtom } from "@/atoms/openDlgAtom";

const cards = [
  {
    date: "February 2025",
    mintedNumber: 500,
    totalSupply: 2500,
  },
  {
    date: "March 2025",
    mintedNumber: 400,
    totalSupply: 2500,
  },
  {
    date: "April 2025",
    mintedNumber: 300,
    totalSupply: 2500,
  },
  {
    date: "May 2025",
    mintedNumber: 200,
    totalSupply: 2500,
  },
  {
    date: "June 2025",
    mintedNumber: 100,
    totalSupply: 2500,
  },
  {
    date: "July 2025",
    mintedNumber: 100,
    totalSupply: 2500,
  },
];

const CarouselCard = () => {
  const { publicKey } = useWallet();
  const [_, setOpen] = useAtom(openDlgAtom);

  const handleClick = (date: string) => {
    if (!publicKey) {
      setOpen(true);
      return;
    }
    console.log("Date: ", date);
  };

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="container mx-auto cursor-grab active:cursor-grabbing"
    >
      <CarouselContent>
        {cards.map(({ date, mintedNumber, totalSupply }) => (
          <CarouselItem key={date} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <Card
              date={date}
              mintedNumber={mintedNumber}
              totalSupply={totalSupply}
              onClick={() => handleClick(date)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

const Card = ({
  date,
  mintedNumber,
  totalSupply,
  onClick,
}: {
  date: string;
  mintedNumber: number;
  totalSupply: number;
  onClick: (date: string) => void;
}) => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col justify-between w-[300px] border-[5px] border-black p-5 gap-3 text-center">
        <div className="flex flex-col">
          <p className="font-bold text-[30px]">{date}</p>
          <p className="text-[30px]">Swag Drop</p>
        </div>
        <div className="flex flex-col">
          <p className="font-semibold text-[24px]">Total Minted</p>
          <p className="text-[24px]">
            {mintedNumber}/{totalSupply}
          </p>
        </div>
        <button
          className="border-[5px] border-black bg-yellow-500 p-2 text-gray-500 font-semibold text-[24px]"
          onClick={() => onClick(date)}
        >
          BUY NOW
        </button>
      </div>
    </div>
  );
};

export default CarouselCard;
