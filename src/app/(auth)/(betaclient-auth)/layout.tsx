import type { Metadata } from "next";
import "../../globals.css";
export const metadata: Metadata = {
  title: "Plentiful Knowledge",
  description: "Plentiful Knowledge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="bg-gray-100">{children}</div>;
}
