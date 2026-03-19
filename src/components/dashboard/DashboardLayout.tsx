"use client";

import React from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import { SMRCDraftProvider } from "@/components/SMRC/SMRCDraftContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SMRCDraftProvider>
      <div className="min-h-screen bg-white">
        <DashboardHeader />
        <main className="grid grid-cols-[280px_1fr] relative" role="main">
          <DashboardSidebar />
          <section className="p-6" role="region">
            {children}
          </section>
        </main>
      </div>
    </SMRCDraftProvider>
  );
}
