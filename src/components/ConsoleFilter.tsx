"use client";

import { useEffect } from "react";

/**
 * Client-side console filter to suppress known harmless warnings
 * from third-party SDKs (Facebook, etc.)
 */
export default function ConsoleFilter() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Store original console methods
    const originalWarn = console.warn;
    const originalError = console.error;

    // Filter function for Facebook XSS warnings
    const shouldSuppress = (message: string): boolean => {
      if (!message) return false;
      const msg = String(message);

      // Suppress Facebook XSS security warnings (harmless, expected behavior)
      if (
        msg.includes("This is a browser feature intended for developers") ||
        msg.includes("facebook.com/selfxss") ||
        msg.includes("Stop!") ||
        (msg.includes("browser feature") && msg.includes("developers"))
      ) {
        return true;
      }

      // Suppress Permissions Policy violations for unload (deprecated event, coming from third-party SDKs)
      if (
        msg.includes("Permissions policy violation") ||
        (msg.includes("violation") && msg.includes("unload")) ||
        msg.includes("unload is not allowed")
      ) {
        return true;
      }

      return false;
    };

    // Override console.warn
    console.warn = (...args: any[]) => {
      const message = String(args[0] || "");
      if (shouldSuppress(message)) {
        return; // Suppress the warning
      }
      originalWarn.apply(console, args);
    };

    // Override console.error (in case Facebook uses console.error)
    console.error = (...args: any[]) => {
      const message = String(args[0] || "");
      if (shouldSuppress(message)) {
        return; // Suppress the error
      }
      originalError.apply(console, args);
    };

    // Cleanup function (though we typically don't restore in production)
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  // This component doesn't render anything
  return null;
}

