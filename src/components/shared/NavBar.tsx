"use client";

import { Menu, User as UserIcon } from "lucide-react";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NavBarProps {
  hideSignInButton?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ hideSignInButton = false }) => {
  // State to manage the visibility of the mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Memoize nav items to prevent re-creation on every render (Got SMRC / Review History moved to dashboard sidebar)
  const navItems = useMemo(() => [
    { name: "How It Works" },
    { name: "Features" },
    { name: "Use Cases" },
    { name: "Pricing" },
    { name: "FAQS" },
  ], []);

  const menuRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape and trap focus when sidebar is open
  useEffect(() => {
    if (!isSidebarOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const openButton = openButtonRef.current; // Capture ref value at effect start

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input[type="text"]:not([disabled])',
      'input[type="radio"]:not([disabled])',
      'input[type="checkbox"]:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const node = menuRef.current;
    if (!node) return;

    // Move focus to first focusable element inside menu
    const focusables = Array.from(node.querySelectorAll<HTMLElement>(focusableSelectors));
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
        e.stopPropagation();
        return;
      }
      if (e.key === 'Tab') {
        if (focusables.length === 0) return;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      // Restore focus to the hamburger/open button using captured value
      (openButton ?? previouslyFocused)?.focus?.();
    };
  }, [isSidebarOpen]);

  const handleSignIn = useCallback(() => {
    router.push("/sign-in");
  }, [router]);

  const handleRequestBetaAccess = useCallback(() => {
    router.push('/beta-client/registration-agreement');
  }, [router]);

  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: '/' });
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <div className="w-full h-20 bg-black flex items-center justify-between px-4 lg:px-6 relative z-20">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" aria-label="Go to homepage" className="flex items-center">
            <Image
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/211de84ad6ebcbd209f5b1e43bf8764ec556b30e"
              alt="Plentiful Knowledge logo"
              width={121}
              height={49}
              className="w-[121px] h-[49px] object-contain"
              priority
            />
          </Link>
          {/* Desktop Navigation Items */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-6 ml-8">
            {navItems.map((item) =>
              "href" in item && item.href ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-center px-[10px] py-2 h-9 text-white font-dm-sans text-base font-normal leading-5 hover:underline hover:underline-offset-4 cursor-pointer"
                >
                  <span>{item.name}</span>
                </Link>
              ) : (
                <div
                  key={item.name}
                  className="flex items-center justify-center px-[10px] py-2 h-9 text-white font-dm-sans text-base font-normal leading-5 hover:underline hover:underline-offset-4 cursor-pointer"
                >
                  <span>{item.name}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Auth Buttons for Desktop */}
        <div className="hidden lg:flex items-center space-x-2 lg:space-x-4">
          {status === "loading" ? (
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="w-[120px] h-[50px] bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="w-[180px] h-[50px] bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          ) : (() => {
            const user = session?.user as { twoFactorRequired?: boolean; twoFactorVerified?: boolean } | undefined;
            return session && (!user?.twoFactorRequired || user?.twoFactorVerified);
          })() ? (
            <>
              {/* User Profile Button */}
              <button
                onClick={() => router.push('/dashboard')}
                className="group flex items-center justify-center w-[120px] lg:w-[152px] h-[40px] lg:h-[50px] px-[8px] lg:px-[10px] py-[10px] lg:py-[14px] border border-white rounded-lg transition-colors hover:bg-white hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                type="button"
                aria-label="Go to dashboard"
              >
                <span className="text-white group-hover:text-[#262c5b] text-center font-dm-sans text-lg font-semibold leading-5">
                  Dashboard
                </span>
              </button>
              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="group flex items-center justify-center w-[120px] lg:w-[152px] h-[40px] lg:h-[50px] px-[8px] lg:px-[10px] py-[10px] lg:py-[14px] border border-[#971A1D] bg-[#971A1D] rounded-lg transition-colors hover:bg-white hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                type="button"
                aria-label="Sign out"
              >
                <span className="text-white group-hover:text-[#971A1D] text-center font-dm-sans text-lg font-semibold leading-5">
                  Sign Out
                </span>
              </button>
            </>
          ) : (
            <>
              {/* Sign In Button (hidden on pages like /sign-in when hideSignInButton is true) */}
              {!hideSignInButton && (
                <button
                  onClick={handleSignIn}
                  className="group flex items-center justify-center w-[120px] lg:w-[152px] h-[40px] lg:h-[50px] px-[8px] lg:px-[10px] py-[10px] lg:py-[14px] border border-white rounded-lg transition-colors hover:bg-white hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  type="button"
                  aria-label="Sign in"
                >
                  <span className="text-white group-hover:text-[#262c5b] text-center font-dm-sans text-lg font-semibold leading-5">
                    Sign In
                  </span>
                </button>
              )}

              {/* Request Beta Client Access Button */}
              <button
                onClick={handleRequestBetaAccess}
                className="group flex items-center justify-center w-[180px] lg:w-[220px] h-[40px] lg:h-[50px] px-[8px] lg:px-[10px] py-[10px] lg:py-[14px] border border-[#971A1D] bg-[#971A1D] rounded-lg transition-colors hover:bg-white hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                type="button"
                aria-label="Request Beta Client Access"
              >
                <span className="text-white group-hover:text-[#971A1D] text-center font-dm-sans text-lg font-semibold leading-5">
                  Request Beta Client Access
                </span>
              </button>
            </>
          )}
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-white focus:outline-none"
            aria-label="Open menu"
            type="button"
            ref={openButtonRef}
          >
            <Menu className="h-8 w-8" />
          </button>
        </div>
      </div>

      {/* Dark Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-25 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar (Sheet) */}
      <div
        className={`fixed inset-y-0 right-0 w-4/5 bg-black bg-opacity-95 z-30 transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out lg:hidden`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
        ref={menuRef}
      >
        <div className="flex flex-col p-4 h-full">
          <div className="flex justify-between items-center w-full">
            <span className="text-white text-2xl font-bold flex-grow text-center">
              Menu
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-white focus:outline-none"
              aria-label="Close menu"
              type="button"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <hr className="border-gray-700 w-full my-4" />
          
          {/* Navigation Items for Mobile */}
          <div className="flex flex-col items-start px-4 py-6 space-y-6 overflow-y-auto flex-grow">
            <div className="text-gray-400 font-dm-sans text-lg font-normal leading-5">
              Explore
            </div>
            {navItems.map((item) =>
              "href" in item && item.href ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white font-dm-sans text-xl font-normal leading-6 hover:text-gray-300 cursor-pointer w-full py-2 block"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span>{item.name}</span>
                </Link>
              ) : (
                <div
                  key={item.name}
                  className="text-white font-dm-sans text-xl font-normal leading-6 hover:text-gray-300 cursor-pointer w-full py-2"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span>{item.name}</span>
                </div>
              )
            )}
            <hr className="border-gray-700 w-full my-4" />
            
            {/* Auth Buttons for Mobile */}
            {status === "loading" ? (
              <div className="w-full space-y-3">
                <div className="w-full h-[50px] bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-full h-[50px] bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            ) : (() => {
              const user = session?.user as { twoFactorRequired?: boolean; twoFactorVerified?: boolean } | undefined;
              return session && (!user?.twoFactorRequired || user?.twoFactorVerified);
            })() ? (
              <>
                <button
                  onClick={() => {
                    router.push('/dashboard');
                    setIsSidebarOpen(false);
                  }}
                  className="group flex items-center justify-center w-full h-[50px] px-[10px] py-[14px] border border-white rounded-lg transition-colors hover:bg-white hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  type="button"
                  aria-label="Go to dashboard"
                >
                  <span className="text-white group-hover:text-[#262c5b] text-center font-dm-sans text-lg font-semibold leading-5">
                    Dashboard
                  </span>
                </button>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsSidebarOpen(false);
                  }}
                  className="group flex items-center justify-center w-full h-[50px] px-[10px] py-[14px] border border-[#971A1D] bg-[#971A1D] rounded-lg transition-colors hover:bg-white hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  type="button"
                  aria-label="Sign out"
                >
                  <span className="text-white group-hover:text-[#971A1D] text-center font-dm-sans text-lg font-semibold leading-5">
                    Sign Out
                  </span>
                </button>
              </>
            ) : (
              <>
                {!hideSignInButton && (
                  <button
                    onClick={() => {
                      handleSignIn();
                      setIsSidebarOpen(false);
                    }}
                    className="group flex items-center justify-center w-full h-[50px] px-[10px] py-[14px] border border-white rounded-lg transition-colors hover:bg-white hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    type="button"
                    aria-label="Sign in"
                  >
                    <span className="text-white group-hover:text-[#262c5b] text-center font-dm-sans text-lg font-semibold leading-5">
                      Sign In
                    </span>
                  </button>
                )}
                <button
                  onClick={() => {
                    handleRequestBetaAccess();
                    setIsSidebarOpen(false);
                  }}
                  className="group flex items-center justify-center w-full h-[50px] px-[10px] py-[14px] border border-[#971A1D] bg-[#971A1D] rounded-lg transition-colors hover:bg-white hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  type="button"
                  aria-label="Request Beta Client Access"
                >
                  <span className="text-white group-hover:text-[#971A1D] text-center font-dm-sans text-lg font-semibold leading-5">
                    Request Beta Client Access
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
