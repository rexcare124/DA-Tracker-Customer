"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserProfileDropdown } from "@/components/shared/UserProfileDropdown";

// --- Auth Buttons Component ---
const AuthButtons = ({ 
  onSignInClick, 
  hideRequestBetaButton = false 
}: { 
  onSignInClick: () => void;
  hideRequestBetaButton?: boolean;
}) => (
  <div className="flex items-center space-x-2 lg:space-x-4">
    <button
      onClick={onSignInClick}
      className="flex cursor-pointer items-center justify-center h-[40px] lg:h-[50px] px-[8px] lg:px-5 py-[10px] lg:py-[14px] border border-brand-red hover:bg-brand-red hover:text-white rounded-lg transition-colors text-brand-red text-center font-dm-sans text-lg font-semibold leading-5"
    >
      Sign In
    </button>
    {!hideRequestBetaButton && (
      <Link
        href={"/beta-client/registration-agreement"}
        className="flex items-center justify-center h-[40px] lg:h-[50px] px-[8px] lg:px-5 py-[10px] lg:py-[14px] border border-[#971A1D] bg-[#971A1D] text-white hover:bg-white hover:text-brand-red hover:border-brand-red rounded-lg transition-colors"
      >
        <span className="text-center font-dm-sans text-lg font-semibold leading-5">
          Request Beta Client Access
        </span>
      </Link>
    )}
  </div>
);

// --- MAIN NAVBAR COMPONENT ---
interface AgreementNavBarProps {
  hideRequestBetaButton?: boolean;
}

const AgreementNavBar: React.FC<AgreementNavBarProps> = ({ 
  hideRequestBetaButton = false 
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State for UI elements
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Optimized session handling - update authentication state without blocking render
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setIsAuthenticated(true);
    } else if (status === "unauthenticated") {
      setIsAuthenticated(false);
    }
  }, [status, session]);

  const handleSignIn = useCallback(() => {
    router.push("/sign-in");
  }, [router]);

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  }, []);

  const navItems = [
    { name: "How It Works" },
    { name: "Features" },
    { name: "Use Cases" },
    { name: "Pricing" },
    { name: "FAQS" },
  ];

  // Optimized auth section rendering - shows buttons immediately, updates when authenticated
  const renderAuthSection = () => {
    // Show authentication buttons immediately for better UX
    if (isAuthenticated && session?.user) {
      const onboardingComplete = (session.user as { onboardingComplete?: boolean }).onboardingComplete;
      
      // Custom trigger to match AgreementNavBar styling
      // Note: Must be a button element for asChild to work properly with DropdownMenuTrigger
      const customTrigger = (
        <button
          type="button"
          className="flex items-center justify-center h-[40px] w-[40px] lg:h-[50px] lg:w-[50px] bg-gray-200 rounded-full text-brand-red hover:bg-gray-300 transition-colors"
          aria-label="Open user menu"
        >
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={50}
              height={50}
              className="rounded-full"
            />
          ) : (
            <UserIcon size={24} />
          )}
        </button>
      );
      
      return (
        <UserProfileDropdown
          trigger={customTrigger}
          showDashboard={onboardingComplete}
          showSettings={onboardingComplete}
          onLogout={handleLogout}
        />
      );
    }
    
    // Always show auth buttons for unauthenticated users (no loading state)
    return (
      <AuthButtons 
        onSignInClick={handleSignIn} 
        hideRequestBetaButton={hideRequestBetaButton}
      />
    );
  };

  return (
    <>
      <div
        className={`w-full fixed h-20 flex items-center justify-between px-4 lg:px-6 z-20 transition-all duration-300 bg-white ${
          isScrolled
            ? "bg-white/80 backdrop-blur-sm shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="flex-shrink-0 flex items-center">
          <Link href="/">
            <Image
              height={300}
              width={300}
              src="/pk-color-logo.png"
              alt="PK Logo"
              className="w-[121px] h-[49px] object-contain"
            />
          </Link>
          {/* Desktop Navigation Items */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-6 ml-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-center px-[10px] py-2 h-9 text-brand-red font-dm-sans text-base font-normal leading-5 hover:underline hover:underline-offset-4 cursor-pointer"
              >
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Buttons for Desktop */}
        <div className="hidden lg:flex items-center space-x-2 lg:space-x-4">
          {renderAuthSection()}
        </div>

        {/* Mobile Menu (Sheet) */}
        <div className="lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="text-brand-red focus:outline-none"
                aria-label="Open menu"
              >
                <Menu className="h-8 w-8" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-4/5 bg-black text-white border-l-0 [&>button]:hidden"
            >
              <SheetHeader>
                <SheetTitle className="text-white text-2xl font-bold text-center">
                  Menu
                </SheetTitle>
                <SheetClose asChild>
                  <button
                    className="absolute top-4 right-4 text-white focus:outline-none"
                    aria-label="Close menu"
                  >
                    <X className="h-8 w-8" />
                  </button>
                </SheetClose>
                <hr className="border-gray-700 w-full my-4" />
              </SheetHeader>
              <div className="flex flex-col items-start px-4 py-6 space-y-6 overflow-y-auto flex-grow">
                <div className="text-gray-400 font-dm-sans text-lg font-normal leading-5">
                  Explore
                </div>
                {navItems.map((item) => (
                  <div
                    key={item.name}
                    className="text-white font-dm-sans text-xl font-normal leading-6 hover:text-gray-300 cursor-pointer w-full py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                  </div>
                ))}
                <hr className="border-gray-700 w-full my-4" />
                <div className="w-full space-y-4">
                  {isAuthenticated ? (
                    <>
                      {session?.user && (session.user as { onboardingComplete?: boolean }).onboardingComplete && (
                        <SheetClose asChild>
                          <Link
                            href="/dashboard"
                            className="block text-white font-dm-sans text-xl font-normal leading-6 hover:text-gray-300"
                          >
                            Dashboard
                          </Link>
                        </SheetClose>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left text-white font-dm-sans text-xl font-normal leading-6 hover:text-gray-300"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <button
                          onClick={() => {
                            handleSignIn();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex cursor-pointer items-center justify-center w-full h-[50px] px-5 py-3.5 border border-white hover:border-brand-red hover:bg-brand-red rounded-lg transition-colors text-white text-center font-dm-sans text-lg font-semibold leading-5"
                        >
                          Sign In
                        </button>
                      </SheetClose>
                      {!hideRequestBetaButton && (
                        <SheetClose asChild>
                          <Link
                            href={"/beta-client/registration-agreement"}
                            className="flex items-center justify-center w-full h-[50px] px-5 py-3.5 border border-[#971A1D] bg-[#971A1D] rounded-lg transition-colors"
                          >
                            <span className="text-white text-center font-dm-sans text-lg font-semibold leading-5">
                              Request Beta Client Access
                            </span>
                          </Link>
                        </SheetClose>
                      )}
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default AgreementNavBar;
