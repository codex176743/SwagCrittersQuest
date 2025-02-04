"use client";

import RouletteSpin from "./roulette";

const RevealCard = () => {
  const handleClick = () => {
    console.log("Reveal Clicked!");
  };

  return (
    <div className="flex flex-col container mx-auto gap-10">
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-10 p-10 rounded-[50px] bg-black items-center">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} onClick={handleClick} />
        ))}
      </div>
      <RouletteSpin />
    </div>
  );
};

const Card = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex flex-col gap-2 bg-black items-center">
      <img
        src="/images/unrevealed.jpg"
        alt="unrevealed"
        className="w-[200px] h-[200px]"
      />
      <button
        className="bg-yellow-500 p-1 text-gray-500 font-semibold text-[24px] text-center"
        onClick={onClick}
      >
        Reveal
      </button>
    </div>
  );
};

export default RevealCard;
