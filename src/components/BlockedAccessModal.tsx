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
import { Button } from "@/components/ui/button";

interface BlockedAccessModalProps {
  open: boolean;
  onRedirect: () => void;
}

export function BlockedAccessModal({ open, onRedirect }: BlockedAccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px] rounded-lg p-6">
        <DialogHeader>
          <DialogTitle>Registration Required</DialogTitle>
          <DialogDescription className="whitespace-pre-line">
            Access to this page is restricted. Please complete your account registration to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            onClick={onRedirect}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm"
          >
            Complete Registration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
