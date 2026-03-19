"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RatingValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RatingValidationModal({
  isOpen,
  onClose,
  onConfirm,
}: RatingValidationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Insufficient Experience to Rate</DialogTitle>
        </DialogHeader>
        <p className="text-[#38464d] text-base mt-2">Are you sure you want to skip the rating?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm}>
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
