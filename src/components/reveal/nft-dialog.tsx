"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const NFTDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>CrittersNFT</DialogTitle>
        </DialogHeader>
        <div>
          <img src="/images/revealed.jpg" alt="revealed image" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NFTDialog;
