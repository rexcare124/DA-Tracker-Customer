"use client";

import Image from "next/image";
import React from "react";

const HeroSection = () => {
  // Placeholder handlers for card actions
  const handleFollowerClick = () => alert('Follower action');
  const handleGroupieClick = () => alert('Groupie action');
  const handleInsiderClick = () => alert('Insider action');
  const handleMicrobusinessClick = () => alert('Biz Leader action');
  const handleDataSeekerClick = () => alert('Data Seeker action');
  const handleBizLeaderClick = () => alert('Biz Leader action');

  return (
    <div
      className="bg-[linear-gradient(rgba(56,70,77,0.75),rgba(56,70,77,0.75))] bg-cover bg-center bg-fixed flex justify-center"
      style={{
        padding: '200px 80px 80px 80px',
      }}
    >
      <div className="max-w-[1140px] w-full custom-margin-container" style={{ marginLeft: '0.8em', marginRight: '0.8em' }}>
      <style>{`
        @media (min-width: 800px) and (max-width: 850px) {
          .custom-margin-container {
            margin-left: 0.32em !important;
            margin-right: 0.32em !important;
          }
        }
      `}</style>
        <p className="text-[#f9fafa] leading-[1.4] text-[36px] text-center mb-[50px] md:text-[28px]">
          STATE & LOCAL GOVERNMENT SHOULD WORK FOR YOU. LET&#39;S DO SOMETHING ABOUT IT.
        </p>
        <p className="text-[#f9fafa] leading-[1.4] text-[28px] text-center mb-[50px] md:text-[20px]">
          MAKE BETTER DECISIONS USING STATE AND LOCAL GOVERNMENT DATA. BECOME A MEMBER TODAY TO LEARN HOW.
        </p>
        {/* Responsive Card Layout: 3 on top row, 1 centered below, 1 button below that */}
        <div className="flex flex-wrap justify-center gap-8">
          <Card title="BECOME A FOLLOWER" imgSrc="/follower.png" onClick={handleFollowerClick} />
          <Card title="BECOME AN INSIDER" imgSrc="/insider.png" onClick={handleInsiderClick} />
          <Card title="BECOME A DATA SEEKER" imgSrc="/data-seeker.png" onClick={handleDataSeekerClick} />
          <Card title="BECOME A BIZ LEADER" imgSrc="/biz-leader.png" onClick={handleMicrobusinessClick} />
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          div.bg-[linear-gradient(rgba(56,70,77,0.75),rgba(56,70,77,0.75))] {
            padding: 130px 20px 20px 20px;
          }
        }
      `}</style>
    </div>
  );
}

interface CardProps {
  title: string;
  imgSrc: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, imgSrc, onClick }) => (
  <div className="flex flex-col items-center bg-white/5 rounded-xl shadow-md p-6 transition hover:scale-105">
    <Image
      src={imgSrc}
      alt={title}
      width={192}
      height={192}
      className="w-48 h-auto mb-6 rounded-lg shadow"
    />
    <button
      onClick={onClick}
      className="mt-4 w-full bg-[#a92d2f] text-white px-6 py-3 rounded-lg font-semibold text-base shadow hover:bg-[#38464d] transition-colors duration-200"
    >
      {title}
    </button>
  </div>
);

export default HeroSection;
