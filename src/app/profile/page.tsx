"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// Define a type for the user profile data to ensure type safety
// This should match the structure of the data returned by your API
interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  stateOfResidence?: string;
  cityOfResidence?: string;
  zipCode?: string;
  dataInterests?: string[];
  rankedMotivations?: string[];
  rankedGovernments?: string[];
  rankedInformationSources?: string[];
  howDidYouHearAboutUs?: string;
  // Add any other fields you expect from your API
}

// A simple component to display a loading spinner, styled for dark mode
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10 min-h-screen bg-black">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-400"></div>
  </div>
);

// A component to render a section of the profile, styled for dark mode
const ProfileSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4 text-gray-300">
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

// A component to display a single piece of data, styled for dark mode
const ProfileDataItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | string[];
}) => {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return null; // Don't render if there's no value
  }

  const displayValue =
    Array.isArray(value) || typeof value === "string" ? value : "Not Provided";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
      <p className="font-medium text-gray-400">{label}:</p>
      <div className="md:col-span-2 text-gray-200">
        {Array.isArray(displayValue) ? (
          <ul className="list-disc list-inside bg-gray-800/50 p-3 rounded-md">
            {displayValue.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="bg-gray-800/50 p-3 rounded-md">{displayValue}</p>
        )}
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    // Check if 2FA is required and not verified
    const user = session?.user as { twoFactorRequired?: boolean; twoFactorVerified?: boolean } | undefined;
    if (user?.twoFactorRequired && !user?.twoFactorVerified) {
      setError("Please complete two-factor authentication to view your profile.");
      setLoading(false);
      return;
    }

    if (session?.user) {
      // User is signed in
      const fetchProfileData = async () => {
        try {
          // Fetch user data from your API using the session user ID
          const response = await fetch(
            `/api/users/${session.user.id || session.user.email}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error: ${response.status}`);
          }

          const data: UserProfile = await response.json();
          setProfileData(data);
        } catch (err: any) {
          console.error("Failed to fetch profile data:", err);
          setError(err.message || "An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      };

      fetchProfileData();
    } else {
      // User is signed out
      setProfileData(null);
      setLoading(false);
      setError("You must be logged in to view this page.");
    }
  }, [session, status]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Error message display, styled for dark mode
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-black text-white p-4">
        <div className="text-center p-8 bg-red-900/20 border border-red-500/50 text-red-300 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // "No Profile Data" message, styled for dark mode
  if (!profileData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-black text-white p-4">
        <div className="text-center p-8 bg-yellow-900/20 border border-yellow-500/50 text-yellow-300 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2">No Profile Data</h2>
          <p>We could not find any profile data for your account.</p>
        </div>
      </div>
    );
  }

  // Main profile view, styled for dark mode
  return (
    <div className="bg-black min-h-screen text-white p-4 sm:p-6 pt-20 lg:p-8">
      <div className="max-w-4xl mx-auto pt-20">
        <div className="bg-gray-900 shadow-xl rounded-lg overflow-hidden border border-gray-800">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold mr-6 flex-shrink-0">
                {profileData.firstName?.charAt(0)}
                {profileData.lastName?.charAt(0)}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-100">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-md text-gray-400">@{profileData.username}</p>
              </div>
            </div>

            <ProfileSection title="Personal Information">
              <ProfileDataItem label="Email" value={profileData.email} />
              <ProfileDataItem
                label="Location"
                value={
                  profileData.cityOfResidence
                    ? `${profileData.cityOfResidence}, ${profileData.stateOfResidence} ${profileData.zipCode}`
                    : "Not Provided"
                }
              />
              <ProfileDataItem
                label="How You Heard About Us"
                value={profileData.howDidYouHearAboutUs}
              />
            </ProfileSection>

            <ProfileSection title="Your Interests">
              <ProfileDataItem
                label="Data Interests"
                value={profileData.dataInterests}
              />
              <ProfileDataItem
                label="Motivations"
                value={profileData.rankedMotivations}
              />
              <ProfileDataItem
                label="Government Interests"
                value={profileData.rankedGovernments}
              />
            </ProfileSection>

            <ProfileSection title="Information Sources">
              <ProfileDataItem
                label="Primary Sources"
                value={profileData.rankedInformationSources}
              />
            </ProfileSection>
          </div>
        </div>
      </div>
    </div>
  );
}
