"use client";

import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";

type RouletteItem = {
  id: string;
  option: string;
  completeOption?: string;
};

const data: RouletteItem[] = [
  {
    id: "1",
    option: "option 1",
  },
  {
    id: "2",
    option: "option 2",
  },
  {
    id: "3",
    option: "option 3",
  },
  {
    id: "4",
    option: "option 4",
  },
  {
    id: "5",
    option: "option 5",
  },
  {
    id: "6",
    option: "option 6",
  },
  {
    id: "7",
    option: "option 7",
  },
  {
    id: "8",
    option: "option 8",
  },
  {
    id: "9",
    option: "option 9",
  },
  {
    id: "10",
    option: "option 10",
  },
  {
    id: "11",
    option: "option 11",
  },
];

const Roulette = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [rouletteData, setRouletteData] = useState(data);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  useEffect(() => {
    const addShortString = data.map((item) => {
      return {
        id: item.id,
        completeOption: item.option,
        option:
          item.option.length >= 30
            ? item.option.substring(0, 30).trimEnd() + "..."
            : item.option,
      };
    });
    setRouletteData(addShortString);
  }, [data]);

  return (
    <>
      <div>
        <Wheel
          mustStartSpinning={mustSpin}
          spinDuration={0.2}
          prizeNumber={prizeNumber}
          data={rouletteData}
          outerBorderColor={"#ccc"}
          outerBorderWidth={9}
          innerBorderColor={"#f2f2f2"}
          radiusLineColor={"tranparent"}
          radiusLineWidth={1}
          textColors={["#f5f5f5"]}
          textDistance={55}
          fontSize={10}
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
        <button className="" onClick={handleSpinClick}>
          SPIN
        </button>
      </div>
      {!mustSpin
        ? rouletteData[prizeNumber].completeOption ||
          rouletteData[prizeNumber].option
        : "Spin..."}
    </>
  );
};

export default Roulette;
