"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Menu,
  X,
  User as UserIcon,
  Chrome,
  Facebook,
  Linkedin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Profile Dropdown Component ---
const ProfileDropDown = ({
  user,
  handleLogout,
}: {
  user: { name?: string | null; image?: string | null };
  handleLogout: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-[40px] w-[40px] lg:h-[50px] lg:w-[50px] bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition-colors"
        aria-label="Open user menu"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "User"}
            width={50}
            height={50}
            className="rounded-full"
          />
        ) : (
          <UserIcon size={24} />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
          onMouseLeave={() => setIsOpen(false)}
        >
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

// --- Auth Buttons Component ---
const AuthButtons = ({ onLoginClick }: { onLoginClick: () => void }) => (
  <div className="flex items-center space-x-2 lg:space-x-4">
    <button
      onClick={onLoginClick}
      className="flex cursor-pointer items-center justify-center h-[40px] lg:h-[50px] px-[8px] lg:px-5 py-[10px] lg:py-[14px] border border-white hover:border-brand-red hover:bg-brand-red rounded-lg transition-colors text-white text-center font-dm-sans text-lg font-semibold leading-5"
    >
      Login
    </button>
    <Link
      href={"/beta-client/registration-agreement"}
      className="flex items-center justify-center h-[40px] lg:h-[50px] px-[8px] lg:px-5 py-[10px] lg:py-[14px] border border-[#971A1D] bg-[#971A1D] hover:bg-white hover:border-white text-white hover:text-brand-red rounded-lg transition-colors"
    >
      <span className="text-center font-dm-sans text-lg font-semibold leading-5">
        Request Beta Client Access
      </span>
    </Link>
  </div>
);

// --- MAIN NAVBAR COMPONENT ---
const NavBar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State for UI elements
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State for the integrated login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Close login modal if it's open when user becomes authenticated
      if (isLoginDialogOpen) {
        setIsLoginDialogOpen(false);
      }
    } else if (status === "unauthenticated") {
      setIsAuthenticated(false);
    }
  }, [status, session, isLoginDialogOpen]);

  // Login Handlers
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });
      
      if (result?.error) {
        setError("Failed to sign in. Please check your credentials.");
        setIsSubmitting(false);
      } else if (result?.ok) {
        // Email login successful - don't set isSubmitting to false here
        // Let the useEffect handle modal closure and state reset
        router.push("/dashboard");
        // isSubmitting will be reset when modal closes via useEffect
      } else {
        // Handle login error
        setError("Invalid email or password");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during sign-in. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook" | "linkedin") => {
    setIsSubmitting(true);
    const result = await signIn(provider, { redirect: false });
    setIsSubmitting(false);
    if (result?.ok) {
      setIsLoginDialogOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  // Reset form state when dialog closes
  const handleModalOpenChange = (open: boolean) => {
    setIsLoginDialogOpen(open);
    if (!open) {
      setEmail("");
      setPassword("");
      setError("");
      setShowPassword(false);
      setIsSubmitting(false);
    }
  };

  const navItems = [
    { name: "Home", href: "/" },
  ];

  // Optimized auth section rendering - shows buttons immediately, updates when authenticated
  const renderAuthSection = () => {
    // Show authentication buttons immediately for better UX
    if (isAuthenticated && session?.user) {
      return (
        <ProfileDropDown user={session.user} handleLogout={handleLogout} />
      );
    }
    
    // Always show auth buttons for unauthenticated users (no loading state)
    return <AuthButtons onLoginClick={() => setIsLoginDialogOpen(true)} />;
  };

  return (
    <>
      <div
        className={`w-full fixed h-20 flex items-center justify-between px-4 lg:px-6 z-20 transition-all duration-300 ${
          isScrolled ? "bg-black/50 backdrop-blur-lg" : "bg-transparent"
        }`}
      >
        <div className="flex-shrink-0 flex items-center">
          <Link href="/">
            <Image
              height={49}
              width={121}
              src="/pk-logo.png"
              alt="PK Logo"
              className="w-[121px] h-[49px] object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2 lg:space-x-4">
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.name}
              className="flex items-center justify-center py-2 h-9 text-white font-dm-sans text-base font-normal leading-5 hover:underline hover:underline-offset-4 cursor-pointer"
            >
              <span>{item.name}</span>
            </Link>
          ))}
          {renderAuthSection()}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="text-white focus:outline-none"
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
              <div className="flex flex-col items-start px-4 py-6 space-y-6">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.name}>
                    <Link
                      href={item.href}
                      className="text-white font-dm-sans text-xl font-normal leading-6 hover:text-gray-300 cursor-pointer w-full py-2"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </SheetClose>
                ))}
                <hr className="border-gray-700 w-full my-4" />
                <div className="w-full space-y-4">
                  {isAuthenticated ? (
                    <>
                      <SheetClose asChild>
                        <Link
                          href="/dashboard"
                          className="block text-white font-dm-sans text-xl font-normal leading-6 hover:text-gray-300"
                        >
                          Dashboard
                        </Link>
                      </SheetClose>
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
                          onClick={() => setIsLoginDialogOpen(true)}
                          className="flex cursor-pointer items-center justify-center w-full h-[50px] px-5 py-3.5 border border-white hover:border-brand-red hover:bg-brand-red rounded-lg transition-colors text-white text-center font-dm-sans text-lg font-semibold leading-5"
                        >
                          Login
                        </button>
                      </SheetClose>
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
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* --- INTEGRATED LOGIN DIALOG --- */}
      <Dialog open={isLoginDialogOpen} onOpenChange={handleModalOpenChange}>
        <DialogContent className="sm:max-w-md bg-white rounded-lg">
          <DialogHeader className="p-6">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Sign in
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Welcome back! Please sign in to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6 space-y-4">
            <div className="space-y-3">
              <Button
                onClick={() => handleSocialLogin("google")}
                disabled={isSubmitting}
                variant="outline"
                className="w-full"
              >
                <Chrome className="mr-2 h-5 w-5" /> Sign in with Google
              </Button>
              <Button
                onClick={() => handleSocialLogin("facebook")}
                disabled={isSubmitting}
                variant="outline"
                className="w-full"
              >
                <Facebook className="mr-2 h-5 w-5" /> Sign in with Facebook
              </Button>
              <Button
                onClick={() => handleSocialLogin("linkedin")}
                disabled={isSubmitting}
                variant="outline"
                className="w-full"
              >
                <Linkedin className="mr-2 h-5 w-5" /> Sign in with LinkedIn
              </Button>
            </div>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-modal">Email</Label>
                <Input
                  id="email-modal"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-modal">Password</Label>
                <div className="relative">
                  <Input
                    id="password-modal"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="bg-white pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
              >
                {isSubmitting ? "Signing in..." : "Sign in with Email"}
              </Button>
            </form>
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
                                                           <Link
                  href="/beta-client/registration-agreement"
                  className="text-blue-600 hover:underline"
                  onClick={() => setIsLoginDialogOpen(false)}
                >
                  Sign Up
                </Link>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NavBar;
