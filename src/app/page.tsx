"use client";

// import { redirect } from "next/navigation";
import CounterState from "@/components/counter-state";
import IncrementButton from "@/components/increment-button";

export default function Home() {
  // redirect("/home");

  return (
    <>
      <CounterState />
      <IncrementButton />
    </>
  );
}
