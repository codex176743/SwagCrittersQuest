"use client";

import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { Button } from "../ui/button";

const data = [
  {
    id: "1",
    option: "Option 1",
  },
  {
    id: "2",
    option: "Option 2",
  },
  {
    id: "3",
    option: "Option 3",
  },
  {
    id: "4",
    option: "Option 4",
  },
  {
    id: "5",
    option: "Option 5",
  },
  {
    id: "6",
    option: "Option 6",
  },
  {
    id: "7",
    option: "Option 7",
  },
  {
    id: "8",
    option: "Option 8",
  },
  {
    id: "9",
    option: "Option 9",
  },
  {
    id: "10",
    option: "Option 10",
  },
  {
    id: "11",
    option: "Option 11",
  },
];

const Roulette = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  return (
    <div className="flex flex-col container mx-auto items-center gap-4">
      <Button variant="outline" onClick={handleSpinClick} disabled={mustSpin}>
        Click to Spin!
      </Button>
      <p className="text-red-500">
        {!mustSpin ? data[prizeNumber].option : "SPIN..."}
      </p>
      <Wheel
        mustStartSpinning={mustSpin}
        spinDuration={0.3}
        prizeNumber={prizeNumber}
        data={data}
        outerBorderColor={"black"}
        outerBorderWidth={25}
        innerBorderColor={"red"}
        innerBorderWidth={8}
        radiusLineColor={"yellow"}
        radiusLineWidth={1}
        textColors={["white"]}
        textDistance={55}
        fontSize={20}
        backgroundColors={[
          "#3f297e",
          "#175fa9",
          "#169ed8",
          "#239b63",
          "#64b031",
          "#efe61f",
          "#f7a416",
          "#e6471d",
          "#dc0936",
          "#e5177b",
          "#be1180",
          "#871f7f",
        ]}
        onStopSpinning={() => {
          setMustSpin(false);
        }}
      />
    </div>
  );
};

export default Roulette;
