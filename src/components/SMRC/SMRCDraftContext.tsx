"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSmrcApiBase } from "@/lib/smrc-api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function isSMRCFormPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === "/dashboard/got-smrc" ||
    pathname === "/dashboard/smrc-previous-residences" ||
    pathname === "/dashboard/smrc-not-resident"
  );
}

type FormSnapshot = {
  getValues: () => Record<string, unknown>;
  getStep: () => number;
  getIsDirty: () => boolean;
  getDraftPayload: () => Record<string, unknown>;
  /** If completing a draft, returns its id so we PATCH instead of POST. */
  getEditingDraftId: () => string | null;
};

type SMRCDraftContextValue = {
  isSMRCFormPath: (path: string | null) => boolean;
  setPendingNavigation: (url: string) => void;
  hasDraft: () => boolean;
  getDraft: () => null;
  clearDraft: () => void;
  registerForm: (
    getValues: () => Record<string, unknown>,
    getStep: () => number,
    getIsDirty: () => boolean,
    getDraftPayload: () => Record<string, unknown>,
    getEditingDraftId: () => string | null,
  ) => void;
  unregisterForm: () => void;
};

const SMRCDraftContext = createContext<SMRCDraftContextValue | null>(null);

export function useSMRCDraft() {
  const ctx = useContext(SMRCDraftContext);
  return ctx;
}

export function SMRCDraftProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pendingNavigation, setPendingNavigationState] = useState<string | null>(null);
  const formRef = useRef<FormSnapshot | null>(null);

  const isOnFormPath = isSMRCFormPath(pathname);

  const setPendingNavigation = useCallback(
    (url: string) => {
      const snap = formRef.current;
      // Only show modal if the user has actually changed something (dirty); pre-filled defaults don't count
      if (!snap?.getIsDirty?.()) {
        router.push(url);
        return;
      }
      setPendingNavigationState(url);
    },
    [router],
  );

  const registerForm = useCallback(
    (
      getValues: () => Record<string, unknown>,
      getStep: () => number,
      getIsDirty: () => boolean,
      getDraftPayload: () => Record<string, unknown>,
      getEditingDraftId: () => string | null,
    ) => {
      formRef.current = { getValues, getStep, getIsDirty, getDraftPayload, getEditingDraftId };
    },
    [],
  );

  const unregisterForm = useCallback(() => {
    formRef.current = null;
  }, []);

  const hasDraft = useCallback(() => false, []);

  const getDraft = useCallback((): null => null, []);

  const clearDraft = useCallback(() => {}, []);

  const closeModal = useCallback(() => {
    setPendingNavigationState(null);
  }, []);

  const handleSaveDraft = useCallback(async () => {
    const url = pendingNavigation;
    if (!url) return;
    const snap = formRef.current;
    if (snap?.getDraftPayload) {
      try {
        const payload = snap.getDraftPayload();
        const editingId = snap.getEditingDraftId?.() ?? null;
        const isUpdate = !!editingId;
        const base = getSmrcApiBase();
        const res = await fetch(isUpdate ? `${base}/${encodeURIComponent(editingId)}` : base, {
          method: isUpdate ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          console.error("SMRC draft save failed", json.error ?? res.statusText);
        }
      } catch (e) {
        console.error("SMRC draft save failed", e);
      }
    }
    setPendingNavigationState(null);
    router.push(url);
  }, [pendingNavigation, router]);

  const handleCancelReview = useCallback(() => {
    const url = pendingNavigation;
    setPendingNavigationState(null);
    if (url) router.push(url);
  }, [pendingNavigation, router]);

  const value: SMRCDraftContextValue = {
    isSMRCFormPath,
    setPendingNavigation,
    hasDraft,
    getDraft,
    clearDraft,
    registerForm,
    unregisterForm,
  };

  return (
    <SMRCDraftContext.Provider value={value}>
      {children}
      <Dialog open={!!pendingNavigation} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-md" hideCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Leave this review?</DialogTitle>
            <DialogDescription>
              Do you want to cancel this review or complete it later? You can save a draft and continue when you return.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="default" className="w-full sm:w-auto" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button type="button" variant="destructive" className="w-full sm:w-auto" onClick={handleCancelReview}>
              Cancel Review
            </Button>
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={closeModal}>
              Continue Editing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SMRCDraftContext.Provider>
  );
}
