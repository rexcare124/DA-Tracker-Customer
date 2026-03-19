"use client";

import NavBar from "@/components/shared/NavBar";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole?.toLowerCase();
      if (
        (userRole === "manager" && pathname.startsWith("/search")) ||
        (userRole === "manager" && pathname === "/")
      ) {
        router.push("/managers/government-entities", { scroll: false });
      } else {
        setIsLoading(false);
      }
    } else {
      // No user (e.g. not logged in) — stop loading so nondashboard pages can render
      setIsLoading(false);
    }
  }, [authUser, router, pathname]);

  if (authLoading || isLoading) return <Loading />;

  return (
    <div className="h-full w-full">
      <DashboardHeader />
      <main className="flex w-full flex-col">{children}</main>
    </div>
  );
};

export default Layout;
