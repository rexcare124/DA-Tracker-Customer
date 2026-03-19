import React from "react";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
  stepNames: string[];
}

const ProgressBar = ({ step, totalSteps, stepNames }: ProgressBarProps) => {
  return (
    <div className="w-full ">
      {/* Step Names - hidden on mobile (screens smaller than sm), visible on sm and up */}
      <div className="flex justify-between text-xs text-gray-600 mb-2 h-4">
        {stepNames.map((name, index) => (
          <span
            key={name}
            className={`font-semibold text-center flex-1 hidden sm:block ${
              index + 1 === step ? "text-brand-blue" : "text-gray-500"
            }`}
          >
            {name}
          </span>
        ))}
      </div>

      {/* Segmented Progress Bar */}
      <div className="flex w-full gap-1.5">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index} className="flex-1 h-2.5 rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                index < step ? "bg-brand-blue" : "bg-transparent"
              }`}
              style={{ width: "100%" }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
