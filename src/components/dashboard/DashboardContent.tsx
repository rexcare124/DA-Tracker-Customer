"use client";

import React from "react";

interface DashboardContentProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  emptyMessage?: string;
}

export default function DashboardContent({
  title,
  subtitle,
  children,
  emptyMessage,
}: DashboardContentProps) {
  return (
    <>
      <h1 id="page-title" className="text-lg font-bold m-0 mb-1">
        {title}
      </h1>
      <p className="text-[#666666] text-[13px] m-0 mb-4">{subtitle}</p>
      {children || (
        <div className="bg-[#f8f9fa] border border-[#ced4da] rounded-xl p-4 mt-4">
          <p className="text-[#666666] text-sm m-0">{emptyMessage || "No data available."}</p>
        </div>
      )}
    </>
  );
}

