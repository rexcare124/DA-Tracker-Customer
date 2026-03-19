"use client";
import { useEffect, useState } from "react";
import { trackCountdownInteraction } from "@/lib/gtag";

// Define the interface for the time left.
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Define the main CountdownTimer component.
export default function CountdownTimer() {
  // State to manage the time left.
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  // State to manage the loading status.
  const [loading, setLoading] = useState(true);

  // useEffect to set up and run the countdown timer.
  useEffect(() => {
    // Set a fixed launch date - 6:00 PM PST on August 15, 2025
    // Convert to UTC: 6:00 PM PST = 2:00 AM UTC on August 16, 2025 (PST is UTC-8)
    const targetDate = new Date('2025-08-16T02:00:00Z'); // 6:00 PM PST on August 15, 2025

    // A function to calculate the time remaining.
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    };

    // Set initial time and immediately turn off the loader.
    setTimeLeft(calculateTimeLeft());
    setLoading(false); // Turn off loading right away.

    // Track countdown timer view
    trackCountdownInteraction('view');

    // Set an interval to update the timer every second.
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(timer);
      }
    }, 1000);

    // Clean up the interval when the component unmounts.
    return () => {
      clearInterval(timer);
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  // A spinner component that visually matches the provided image.
  const Spinner = () => (
    <div className="flex justify-center items-center h-24">
      <div className="animate-spin rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-4 border-solid border-gray-300 border-t-gray-800"></div>
    </div>
  );

  // The component for each circular timer element.
  const CircularTimer = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
        {/* Outer circle with gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#971a1d] to-[#c41619] shadow-lg"></div>
        {/* Inner circle with gradient and text */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#971a1d] to-[#631b1c] flex items-center justify-center shadow-inner">
          <span className="text-white font-bold text-sm sm:text-lg md:text-xl lg:text-2xl">
            {value.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
      {/* Label for the timer unit */}
      <span className="text-white text-xs sm:text-sm md:text-lg font-medium mt-2 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  // The main return statement for the component.
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 my-6">
      {/* Conditionally render the spinner or the timer circles */}
      {loading ? (
        <Spinner />
      ) : (
        <>
          <CircularTimer value={timeLeft.days} label="Days" />
          <CircularTimer value={timeLeft.hours} label="Hours" />
          <CircularTimer value={timeLeft.minutes} label="Minutes" />
          <CircularTimer value={timeLeft.seconds} label="Seconds" />
        </>
      )}
    </div>
  );
}
