"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Navigation component providing site navigation with smooth scrolling.
 * Includes responsive mobile menu functionality.
 *
 * @returns JSX element containing the navigation bar
 */
export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Home", href: "#home" },
    { name: "SHARE TESTIMONIAL", href: "#everyday-people" },
    { name: "View Data", href: "#view-data" },
    { name: "Donate", href: "#donate" },
    { name: "FAQS", href: "#faqs" },
  ];

  const authItems = [
    {
      name: "Sign Up",
      href: "/beta-client/registration-agreement",
      className:
        "bg-california-blue text-white px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 hover:bg-california-blue/90 hover:-translate-y-0.5 hover:shadow-lg",
    },
    {
      name: "Sign In",
      href: "/sign-in",
      className:
        "border-2 border-emergency-orange text-emergency-orange px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-200 hover:bg-emergency-orange hover:text-white",
    },
  ];

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="#home"
            className="flex items-center space-x-2"
            onClick={(e) => scrollToSection(e, "#home")}
          >
            <Image
              src="/images/dat-logo-transparent.png"
              alt="DATracker logo"
              width={140}
              height={40}
              className="h-10 w-auto md:h-12"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={(e) => scrollToSection(e, item.href)}
                className="text-gray-700 hover:text-california-blue font-medium transition-colors duration-200 text-sm uppercase tracking-wide hover:underline hover:decoration-[#e85a24] hover:decoration-2 hover:underline-offset-8 focus-visible:underline focus-visible:decoration-[#e85a24] focus-visible:decoration-2 focus-visible:underline-offset-8"
              >
                {item.name}
              </button>
            ))}
            <div className="flex items-center space-x-3 pl-2">
              {authItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={item.className}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={(e) => scrollToSection(e, item.href)}
                className="block w-full text-left py-3 text-gray-700 hover:text-california-blue font-medium transition-colors duration-200 text-sm uppercase tracking-wide hover:underline hover:decoration-[#e85a24] hover:decoration-2 hover:underline-offset-4 focus-visible:underline focus-visible:decoration-[#e85a24] focus-visible:decoration-2 focus-visible:underline-offset-4"
              >
                {item.name}
              </button>
            ))}
            <div className="mt-4 space-y-3">
              {authItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block text-center ${item.className}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
