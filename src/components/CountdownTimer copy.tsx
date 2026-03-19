"use client";
import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date to 30 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const CircularTimer = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#971a1d] to-[#c41619] shadow-lg"></div>
        <div className="absolute inset-1 rounded-full bg-gradient-to-br  from-[#971a1d] to-[#631b1c]  flex items-center justify-center shadow-inner">
          <span className="text-white font-bold text-sm sm:text-lg md:text-xl lg:text-2xl">
            {value.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
      <span className="text-white text-xs sm:text-sm md:text-lg  font-medium mt-2 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 my-6">
      <CircularTimer value={timeLeft.days} label="Days" />
      <CircularTimer value={timeLeft.hours} label="Hours" />
      <CircularTimer value={timeLeft.minutes} label="Minutes" />
      <CircularTimer value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}
