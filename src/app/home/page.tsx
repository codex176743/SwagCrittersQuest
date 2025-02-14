"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const monthArray = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const HomePage = () => {
  const [buyMonth, setBuyMonth] = useState<number>(0);

  useEffect(() => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    if (day > 15) {
      setBuyMonth((currentDate.getMonth() + 1) % 12);
    } else {
      setBuyMonth(currentDate.getMonth());
    }
  }, []);

  return (
    <div className="container mx-auto grid lg:grid-cols-9 md:grid-cols-3 justify-items-center gap-32 px-10">
      <div className="flex flex-col w-full justify-between border-[5px] border-black p-5 gap-10 text-center col-span-3">
        <p className="font-bold text-[40px]">NOW SELLING</p>
        <p className="font-semibold text-[35px] px-5">
          {monthArray[buyMonth] + " Swag Drop"}
        </p>
        <Link
          className="border-[5px] border-black bg-yellow-500 hover:bg-yellow-300 p-2 text-gray-500 font-semibold text-[30px]"
          href="/buy"
        >
          BUY NOW
        </Link>
      </div>
      <div className="flex flex-col w-full justify-between border-[5px] border-black p-5 gap-10 text-center col-span-3">
        <p className="font-bold text-[40px]">REVEAL SWAG</p>
        <p className="font-semibold text-[35px]">
          {monthArray[(buyMonth + 11) % 12] + " Reveal"} <br /> Now Available
        </p>
        <Link
          className="border-[5px] border-black bg-yellow-500 hover:bg-yellow-300 p-2 text-gray-500 font-semibold text-[30px]"
          href="/reveal"
        >
          REVEAL NOW
        </Link>
      </div>
      <div className="flex flex-col w-full justify-between border-[5px] border-black p-5 gap-5 text-center col-span-3">
        <p className="font-bold text-[40px]">REDEEM</p>
        <p className="font-semibold text-[35px]">Ready to Ship and Burn?</p>
        <Link
          className="border-[5px] border-black bg-yellow-500 hover:bg-yellow-300 p-2 text-gray-500 font-semibold text-[30px]"
          href="/redeem"
        >
          ORDER NOW
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
