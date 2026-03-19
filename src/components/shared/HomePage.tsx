"use client";

import NavBar from "./NavBar";
import CityModal from "./CityModal";
import { CircleHelp } from "lucide-react";

const HomePage = () => {
  return (
    <>
      <div className="min-h-screen bg-main-bg relative overflow-x-hidden">
        {/* Navigation Bar */}
        <NavBar />

        {/* Hero Section */}
        <div className="relative px-4 lg:px-0">
          {/* Main Tagline */}
          <div className="w-full flex items-center justify-center mt-4 lg:mt-[22px] px-4">
            <span className="text-white text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight font-dm-sans">
              DISCOVER VALUABLE INSIGHTS USING AI AND OUR CURATED DATA.
            </span>
          </div>

          {/* Subtitle with inline Question Mark */}
          <div className="w-full flex items-center justify-center mt-2 md:mt-4 lg:mt-[12px] px-4">
            <div className="text-center flex items-center justify-center flex-wrap max-w-screen-md">
              <span className="text-white text-center font-dm-sans text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-snug">
                GET STARTED MAKING BETTER DECISIONS. BECOME A MEMBER TODAY TO LEARN MORE ABOUT THE
                CITY OF FOLSOM.
                <span className="relative group ml-1 inline-block">
                  <CircleHelp
                    className="text-white h-3 w-3 md:h-5 md:w-5"
                    role="img"
                    aria-describedby="vpn-tip"
                    aria-label="VPN info"
                  />
                  {/* Hover Tooltip */}
                  <div
                    className="absolute bottom-5 -right-5 md:bottom-8 md:-right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-50 text-left"
                    role="tooltip"
                    id="vpn-tip"
                    aria-hidden
                  >
                    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-xl w-40 md:w-64 relative text-left motion-reduce:transition-none">
                      <p className="text-[8px] md:text-xs leading-relaxed font-normal text-left">
                        Using a VPN does impact the accuracy of information shown below: Create a
                        free, guest account and login for the best online experience.
                      </p>
                      {/* Tooltip Arrow pointing down */}
                      <div className="absolute -bottom-2 right-5 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </span>
              </span>
            </div>
          </div>

          {/* City Modal - Positioned below the text sections */}
          <div className="flex justify-center mt-5 lg:mt-10">
            <div className="scale-75 sm:scale-90 lg:scale-100 origin-top">
              <CityModal />
            </div>
          </div>

          {/* Add some bottom padding for mobile */}
          <div className="h-16 lg:h-0"></div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
