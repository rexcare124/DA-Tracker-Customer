"use client";

import {
  ChevronLeft,
  ChevronRight,
  Heart,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import React, { useState } from "react";
import SignInModal from "./SignInModal";
import type { GovernmentEntityWithRelations } from "@/types/governmentEntityTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function getLocationString(entity: GovernmentEntityWithRelations): string {
  const parts: string[] = [];
  if (entity.city?.cityName) parts.push(entity.city.cityName);
  if (entity.county?.countyName) parts.push(`${entity.county.countyName} County`);
  if (entity.state?.stateName) parts.push(entity.state.stateName);
  return parts.join(", ") || "Location not available";
}

export interface CityModalProps {
  /** When provided (e.g. dashboard favorite), show this entity; otherwise show static City of Folsom */
  entity?: GovernmentEntityWithRelations | null;
  /** When provided with entity, "View Public Service Reviews" calls this instead of opening SignIn */
  onViewPublicServiceReviews?: () => void;
  /** When provided with entity, heart shows favorite state and this is called on click */
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
  /** True while favorite toggle is in progress */
  favoriteLoading?: boolean;
  /** When true, card stretches to full width of container (e.g. dashboard grid column) */
  fullWidth?: boolean;
}

const CityModal = ({
  entity = null,
  onViewPublicServiceReviews,
  isFavorite = false,
  onFavoriteClick,
  favoriteLoading = false,
  fullWidth = false,
}: CityModalProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const isEntityMode = entity != null;
  const entityName = isEntityMode ? entity.entityName : "City of Folsom";
  const locationLine = isEntityMode ? getLocationString(entity) : "Sacramento County, California";
  const subtitleLine =
    isEntityMode && entity.governmentLevel
      ? entity.governmentLevel.levelName
      : "Mayor Mike Johnson (Democrat)";
  const countyLabel =
    isEntityMode && entity.county?.countyName
      ? `View ${entity.county.countyName} County`
      : "View Sacramento County";
  const stateLabel =
    isEntityMode && entity.state?.stateName
      ? `View State of ${entity.state.stateName}`
      : "View State of California";

  const metrics = [
    {
      title: "Crime Solve Rate",
      percentage: "-18%",
      trend: "down" as const,
    },
    {
      title: "Unemployment Rate",
      percentage: "+12%",
      trend: "up" as const,
    },
    {
      title: "Population Decline",
      percentage: "-5%",
      trend: "down" as const,
    },
    {
      title: "New Business Licenses",
      percentage: "+8%",
      trend: "up" as const,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % metrics.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + metrics.length) % metrics.length);
  };

  const currentMetric = metrics[currentSlide];

  // Function to open the sign-in modal
  const handleOpenSignInModal = () => {
    setIsSignInModalOpen(true);
  };

  // Function to close the sign-in modal
  const handleCloseSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  const handlePrimaryAction = () => {
    if (isEntityMode && onViewPublicServiceReviews) {
      onViewPublicServiceReviews();
    } else {
      handleOpenSignInModal();
    }
  };

  const handleHeartClick = () => {
    if (!isEntityMode) {
      handleOpenSignInModal();
    }
  };

  const handleRemoveConfirmYes = () => {
    onFavoriteClick?.();
    setRemoveConfirmOpen(false);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg relative font-inter ${
        isEntityMode
          ? `w-full max-h-[520px] flex flex-col overflow-hidden ${fullWidth ? "" : "max-w-[420px] mx-auto"}`
          : "w-[450px] mx-auto overflow-hidden"
      }`}
    >
      {/* Top Dark Section */}
      <div className="w-full h-[160px] flex-shrink-0 bg-modal-bg relative">
        {/* Warning Banner */}
        <div className="absolute top-4 left-4 flex items-center bg-white rounded-full px-4 py-1.5 shadow-sm">
          <TriangleAlert className="mr-2 text-red-500" />
          <span className="text-gray-500 text-sm font-medium">
            Credit Rating Downgraded March 2025
          </span>
        </div>

        {/* Heart Icon - only on home page (no entity); opens SignIn */}
        {!isEntityMode && (
          <div
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={handleHeartClick}
            role="button"
            aria-label="Sign in"
          >
            <Heart className="text-[#999999]" />
          </div>
        )}

        {/* Title */}
        <div className="absolute bottom-[70px] left-1/2 transform -translate-x-1/2">
          <span className="text-white font-medium text-base">{currentMetric.title}</span>
        </div>

        {/* Metric Box */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-4 py-1.5 flex items-center shadow-sm">
          <span
            className={`font-semibold text-lg ${
              currentMetric.trend === "down" ? "text-red-500" : "text-green-600"
            }`}
          >
            {currentMetric.percentage}
          </span>
          {currentMetric.trend === "down" ? (
            <TrendingDown className="ml-1 text-red-500 rotate-90" />
          ) : (
            <TrendingUp className="ml-1 text-green-500" />
          )}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-[60%] transform -translate-y-1/2 text-white p-2 hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          type="button"
          aria-label="Previous metric"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-[60%] transform -translate-y-1/2 text-white p-2 hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          type="button"
          aria-label="Next metric"
        >
          <ChevronRight className="h-8 w-8" />
        </button>

        {/* Dots Indicator */}
        <div
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1"
          role="tablist"
          aria-label="Metric slides"
        >
          {metrics.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                index === currentSlide ? "bg-white h-2.5 w-2.5" : "bg-white/50"
              }`}
              role="tab"
              aria-selected={index === currentSlide}
              aria-controls={`metric-panel-${index}`}
              type="button"
            />
          ))}
        </div>
      </div>

      {/* Bottom White Section */}
      <div className={`p-4 space-y-4 ${isEntityMode ? "flex-1 min-h-0 overflow-auto" : ""}`}>
        {/* Location Section */}
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gray-100 shadow-xl rounded-md flex items-center justify-center flex-shrink-0 mt-1">
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black">{entityName}</h3>
              <div className="">
                <button
                  onClick={!isEntityMode ? handleOpenSignInModal : undefined}
                  className="hidden md:inline-flex px-3 py-1 bg-gray-400 text-white text-xs rounded-md cursor-pointer transition-colors"
                >
                  View City Metrics
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600">{locationLine}</p>
            <p className="text-sm text-gray-600">{subtitleLine}</p>

            <div className="flex flex-wrap justify-between gap-2 mt-2">
              <button
                onClick={!isEntityMode ? handleOpenSignInModal : undefined}
                className="hidden md:inline-flex px-3 py-1 bg-blue-500 opacity-50 text-white text-xs rounded-md cursor-pointer transition-opacity"
              >
                {countyLabel}
              </button>
              <button
                onClick={!isEntityMode ? handleOpenSignInModal : undefined}
                className="hidden md:inline-flex px-3 py-1 bg-orange-500 opacity-50 text-white text-xs rounded-md cursor-pointer hover:opacity-75 transition-opacity"
              >
                {stateLabel}
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="">
              <div className="w-8 h-8 bg-gray-100 shadow-xl rounded-md flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="flex-1">
              <h4 className="text-base font-semibold text-black mb-3">
                Key City Government Metrics
              </h4>

              <div className="grid grid-cols-2 gap-y-2 text-sm">
                {/* Left Column Items */}
                <div className="pr-4 border-r border-gray-300">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-600 text-xs">13% Homelessness Rate</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-600 text-xs">8% Unemployment Rate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-600 text-xs">-6% Public School Enrollment</span>
                  </div>
                </div>

                {/* Right Column Items */}
                <div className="pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-600 text-xs">$2.5M Recent Investment</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-600 text-xs">15 New Development Projects</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-600 text-xs">$275K Tax Revenue Increase</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Public Service Reviews - same size class for matching height */}
        <button
          onClick={handlePrimaryAction}
          className="w-full bg-gray-400 text-white py-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200/60"
          type="button"
          aria-label="View public service reviews"
        >
          View Public Service Reviews
        </button>

        {/* Remove from Favorites - only in entity (dashboard) mode; same width/height as VPSR */}
        {isEntityMode && onFavoriteClick && (
          <button
            onClick={() => setRemoveConfirmOpen(true)}
            disabled={favoriteLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200/60 disabled:opacity-50"
            type="button"
            aria-label="Remove from favorites"
          >
            Remove from Favorites
          </button>
        )}
      </div>

      {/* Remove from favorites confirmation modal */}
      <Dialog open={removeConfirmOpen} onOpenChange={setRemoveConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from favorites?</DialogTitle>
            <DialogDescription>
              Do you want to remove {entityName} from your favorites?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveConfirmOpen(false)}>
              No
            </Button>
            <Button variant="destructive" onClick={handleRemoveConfirmYes}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sign-in Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={handleCloseSignInModal}
        title="Sign in using a paid subscription to access this feature."
        description="Visit the dashboard to learn more about your membership."
      />
    </div>
  );
};

export default CityModal;
