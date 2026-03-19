import AgreementNavBar from "@/components/AgreementNavBar";

export default function AgreementLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gray-100">
      <AgreementNavBar hideRequestBetaButton />
      <section className="pt-20">{children}</section>
    </div>
  );
}
