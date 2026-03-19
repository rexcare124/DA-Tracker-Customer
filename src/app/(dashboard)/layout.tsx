"use client";

// import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";

// Lazy load AppSidebar component (heavy component with navigation logic)
const Sidebar = dynamic(() => import("@/components/AppSidebar"), {
  loading: () => (
    <div className="w-64 h-screen bg-gray-100">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-12 w-full mt-4" />
      <Skeleton className="h-12 w-full mt-2" />
      <Skeleton className="h-12 w-full mt-2" />
    </div>
  ),
  ssr: false, // Disable SSR for sidebar (uses client-side hooks)
});

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole?.toLowerCase();
      if (
        (userRole === "manager" && pathname.startsWith("/locals")) ||
        (userRole === "local" && pathname.startsWith("/managers"))
      ) {
        router.push(
          userRole === "manager"
            ? "/managers/properties"
            : "/dashboard",
          { scroll: false }
        );
      } else {
        setIsLoading(false);
      }
    }
  }, [authUser, router, pathname]);

  if (authLoading || isLoading) return <Loading />;
  if (!authUser?.userRole) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-primary-100">
        {/* <Navbar /> */}
        <div style={{ marginTop: `${NAVBAR_HEIGHT}px` }}>
          <main className="flex">
            <Sidebar />
            <div className="flex-grow transition-all duration-300">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
