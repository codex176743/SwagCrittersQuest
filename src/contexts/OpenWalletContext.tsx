"use client";

import React, { createContext, useState } from "react";

export const OpenWalletContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => {},
});

export const OpenWalletProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false); // Initial state

  return (
    <OpenWalletContext.Provider value={{ open, setOpen }}>
      {children}
    </OpenWalletContext.Provider>
  );
};
