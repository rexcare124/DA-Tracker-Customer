"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SubmittedReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmittedReviewModal({ isOpen, onClose }: SubmittedReviewModalProps) {
  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push("/dashboard/review-history");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Review Submitted</DialogTitle>
        </DialogHeader>
        <p className="text-base leading-relaxed mt-4">
          Your review has been saved. Thank you for sharing your public service experience.
        </p>
        <div className="flex justify-center mt-6">
          <Button type="button" onClick={handleClose}>
            Ok
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
