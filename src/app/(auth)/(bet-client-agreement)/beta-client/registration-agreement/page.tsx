"use client";

import Link from "next/link";
import { useState } from "react";

export default function BetaProgramPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleYesClick = () => {
    setIsLoading(true);
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-background">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-card">
        {/* Page Header */}
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-foreground">
          Beta Client Program
        </h1>
        <p className="mb-6 text-gray-700 dark:text-muted-foreground">
          We&apos;re currently allowing limited access to our platform through
          our beta client program.
        </p>

        {/* List of Benefits */}
        <ul className="mb-6 list-disc space-y-3 pl-5 text-gray-700 dark:text-muted-foreground">
          <li>
            Opportunity to influence the adoption and implementation of features
          </li>
          <li>Priority access to new features</li>
          <li>Access to priority support and account management</li>
          <li>Substantially discounted subscription for one year.</li>
        </ul>

        {/* Call to Action */}
        <p className="mb-6 text-lg font-semibold text-gray-900 dark:text-foreground">
          Do You Wish to Proceed?
        </p>

        {/* Buttons */}
        <div className="flex justify-center  space-x-3">
          <Link
            // No onClick for cancel here, as it's a page.
            // If this were a form, this might reset it or navigate elsewhere.
            className="rounded-md min-w-32 text-center bg-brand-red px-4 py-2  shadow-sm  text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
            href="/"
          >
            No
          </Link>
          <Link
            href="/beta-client/registration"
            onClick={handleYesClick}
            className={`rounded-md min-w-32 text-center px-4 py-2 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-75 ${
              isLoading 
                ? 'bg-brand-darkblue cursor-wait' 
                : 'bg-brand-blue hover:bg-brand-darkblue dark:bg-brand-blue dark:hover:bg-brand-blue/80'
            }`}
          >
            {isLoading ? 'Loading...' : 'Yes'}
          </Link>
        </div>
      </div>
    </div>
  );
}
