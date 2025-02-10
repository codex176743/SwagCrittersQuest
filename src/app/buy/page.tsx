import BuyNFT from "@/components/buy/buy-nft";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

const BuyPage = () => {
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
            <BuyNFT
              date={date}
              mintedNumber={mintedNumber}
              totalSupply={totalSupply}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default BuyPage;
