"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const NFTDialog = ({
  name,
  imageUrl,
  open,
  setOpen,
}: {
  name: string;
  imageUrl: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <img src={imageUrl} alt="revealed image" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NFTDialog;
