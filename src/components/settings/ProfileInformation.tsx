"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { Session } from "next-auth";
import type { AppUserWithProfile } from "@/types/user-profile";

interface ProfileInformationProps {
  session: Session;
  authUser: AppUserWithProfile;
  onProfileUpdate?: () => void;
}

export default function ProfileInformation({
  session,
  authUser,
  onProfileUpdate,
}: ProfileInformationProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const formatLocation = () => {
    // Use the location field if available (pre-formatted from API)
    if (authUser?.location) {
      return authUser.location;
    }
    
    // Otherwise, construct from parts
    const parts = [
      authUser?.state,
      authUser?.cityOfResidence || authUser?.city, // Use cityOfResidence which may include county
      authUser?.zipCode,
    ].filter((el) => !!el?.trim());
    return parts.length > 0 ? parts.join(", ") : "Not specified";
  };

  const formatPrivacyLevel = (level?: string, levelText?: string) => {
    // Use the text value if available (from Firebase)
    if (levelText) {
      return levelText;
    }
    
    // Otherwise, map the level code to text
    if (!level) return "Not set";
    const levels: Record<string, string> = {
      public: "Public",
      private: "Private",
      full_name: "Your Full Name",
      first_name_only: "First Name Only",
      initials_only: "Initials Only",
    };
    return levels[level] || level;
  };

  const formatFullName = () => {
    const parts = [
      authUser?.prefix,
      authUser?.firstName,
      authUser?.lastName,
      authUser?.suffix,
    ].filter((el) => !!el?.trim());
    return parts.length > 0 ? parts.join(" ") : session?.user?.name || "Not set";
  };

  const formatMembership = () => {
    if (authUser?.hasPodiaMembership && authUser?.podiaMembershipLevel) {
      return authUser.podiaMembershipLevel;
    }
    return "Guest User";
  };

  return (
    <>
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        authUser={authUser}
        onProfileUpdate={onProfileUpdate}
      />
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <Card className="bg-[#f8f9fa] border-[#ced4da]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#333333]">
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Profile Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#333333] uppercase tracking-wide">
                Full Name
              </p>
              <p className="text-base text-[#333333]">
                {formatFullName()}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#333333] uppercase tracking-wide">
                Email
              </p>
              <p className="text-base text-[#333333]">
                {session?.user?.email || "Not set"}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#333333] uppercase tracking-wide">
                Membership
              </p>
              <p className="text-base text-[#333333]">
                {formatMembership()}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#333333] uppercase tracking-wide">
                Residential Location
              </p>
              <p className="text-base text-[#333333]">
                {formatLocation()}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#333333] uppercase tracking-wide">
                Privacy Level
              </p>
              <p className="text-base text-[#333333]">
                {formatPrivacyLevel(authUser?.privacyLevel ?? undefined, authUser?.privacyLevelText ?? undefined)}
              </p>
            </div>
          </div>

          <Separator className="my-6 bg-[#ced4da]" />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              variant="link"
              onClick={() => setShowEditModal(true)}
              className="text-[#0b83e6dc] hover:text-[#005a9e] p-0 h-auto font-semibold text-base"
            >
              Edit profile
            </Button>

            {/* Only show "Change Password" for email/password users */}
            {authUser?.signInMethod === 'email' && (
              <Button
                variant="link"
                onClick={() => setShowPasswordModal(true)}
                className="text-[#333333] hover:text-[#000000] p-0 h-auto font-semibold text-base"
              >
                Change Password
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

