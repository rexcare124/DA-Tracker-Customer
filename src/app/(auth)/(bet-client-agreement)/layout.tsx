import type { Metadata } from "next";

import AgreementNavBar from "@/components/AgreementNavBar";

export const metadata: Metadata = {
  title: "Plentiful Knowledge",
  description: "Plentiful Knowledge",
};

export default function AgreementLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AgreementNavBar hideRequestBetaButton />
      {children}
    </>
  );
}
