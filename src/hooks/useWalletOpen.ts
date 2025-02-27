import { useContext } from "react";
import { OpenWalletContext } from "@/contexts/OpenWalletContext";

export const useWalletOpen = () => {
  return useContext(OpenWalletContext);
};
