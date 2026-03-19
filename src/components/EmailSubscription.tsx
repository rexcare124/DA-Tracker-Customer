"use client";
import { useState } from "react";

export default function EmailSubscription() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send the email to your backend
      setIsSubmitted(true);
      setEmail("");

      // Reset the success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      {isSubmitted ? (
        <div className="text-center animate-fadeIn">
          <div className="bg-green-500 text-white px-4 sm:px-6 py-3 rounded-full text-sm sm:text-base shadow-lg">
            Thank you for subscribing! We&apos;ll notify you when we launch.
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 sm:gap-2"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="YOUR EMAIL ID"
            className="flex-1 bg-black/40 backdrop-blur-sm border border-gray-500 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-white placeholder-gray-300 focus:outline-none focus:border- focus:ring-2 focus:ring-[#262c5b] transition-all duration-300 text-sm sm:text-base"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-[#2d4093] to-[#262c5b] hover:from-[#262c5b] hover:to-[#2d4093] text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            SUBSCRIBE
          </button>
        </form>
      )}
    </div>
  );
}
