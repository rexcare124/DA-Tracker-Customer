import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import React from "react";

// Types
export type PropsType = {
  followerRef?: any;
  groupieRef?: any;
  insiderRef?: any;
  microbusinessRef?: any;
  dataSeekerRef?: any;
};

export const MembershipComparison = ({
  followerRef,
  groupieRef,
  insiderRef,
  microbusinessRef,
  dataSeekerRef,
}: PropsType) => {
  return (
    <div className="py-20 px-4 bg-[#e7e7e7]">
      <p className="text-[#38464d] leading-snug text-[30px] text-center mb-12 font-semibold">
        CHOOSE THE PLAN THAT&#39;S RIGHT FOR YOU
      </p>
      <div className="flex flex-wrap justify-center items-start gap-5">
        {/* Follower */}
        <div ref={followerRef} className="bg-white rounded-[10px] mt-2 p-8 w-[320px] flex flex-col items-stretch mb-8 sm:mb-0">
          <p className="text-[24px] font-semibold text-center mb-5">Follower</p>
          <p className="text-[30px] text-center mb-4">$TBD/month</p>
          <div className="flex items-start mb-2 w-full">
            <CheckCircle2 className="min-w-[30px] min-h-[30px] text-white fill-[#313235] mr-1" />
            <p className="text-[18px]">Ad-free content</p>
          </div>
          <div className="flex items-start mb-2 w-full">
            <CheckCircle2 className="min-w-[30px] min-h-[30px] text-white fill-[#313235] mr-1" />
            <p className="text-[18px]">
              Full access to{' '}
              <a href="/dashboard/got-smrc" className="underline text-[#0b83e6dc]">State Municipal Report Card (SMRC)</a>{' '}
              reviews and government responses for your home zip code<sup>*</sup>
            </p>
          </div>
          <div className="w-full mb-2">
            <p className="text-[12px]">
              <sup>*</sup> Restrictions apply
            </p>
          </div>
          <Link href="#" target="_blank">
            <button className="w-full h-[50px] px-4 bg-[#313235] text-white border border-[#313235] shadow rounded-lg cursor-pointer font-medium text-[18px] mt-6 hover:bg-[#971a1d] hover:border-[#971a1d] transition-colors">Signup</button>
          </Link>
        </div>
        {/* Insider (Most Popular) */}
        <div ref={insiderRef} className="bg-white rounded-[10px] mt-2 p-8 w-[320px] flex flex-col items-stretch border-4 border-[#971a1d] relative">
          <div className="bg-[#971a1d] text-white w-[140px] h-[60px] rounded-[10px] text-[18px] flex justify-center items-center text-center absolute -top-10 left-1/2 -translate-x-1/2 shadow">Most Popular</div>
          <p className="text-[24px] font-semibold text-center mb-5 mt-6">Insider</p>
          <p className="text-[30px] text-center mb-2">$TBD/month</p>
          <p className="text-[18px] font-semibold mb-5">Everything in Follower and...</p>
          <div className="flex items-start mb-2 w-full">
            <CheckCircle2 className="min-w-[30px] min-h-[30px] text-white fill-[#313235] mr-1" />
            <p className="text-[18px]">Full access to SMRC reviews and government responses for five zip codes<sup>*</sup></p>
          </div>
          <div className="flex items-start mb-2 w-full">
            <CheckCircle2 className="min-w-[30px] min-h-[30px] text-white fill-[#313235] mr-1" />
            <p className="text-[18px]">Preferred support for inquiries (guaranteed reply within 24 hours)</p>
          </div>
          <div className="w-full mb-2">
            <p className="text-[12px]"><sup>*</sup> Restrictions apply</p>
          </div>
          <Link href="#" target="_blank">
            <button className="w-full h-[50px] px-4 bg-[#313235] text-white border border-[#313235] shadow rounded-lg cursor-pointer font-medium text-[18px] mt-6 hover:bg-[#971a1d] hover:border-[#971a1d] transition-colors">Signup</button>
          </Link>
        </div>
        {/* Data Seeker */}
        <div ref={dataSeekerRef} className="bg-white rounded-[10px] mt-2 p-8 w-[320px] flex flex-col items-stretch">
          <p className="text-[24px] font-semibold text-center mb-5">Data Seeker</p>
          <p className="text-[30px] text-center mb-2">$TBD/month</p>
          <p className="text-[18px] font-semibold mb-5">Everything in Insider and...</p>
          <div className="flex items-start mb-2 w-full">
            <CheckCircle2 className="min-w-[30px] min-h-[30px] text-white fill-[#313235] mr-1" />
            <p className="text-[18px]">Online access to Plentiful Knowledge&#39;s state and municipal government datasets and document collections</p>
          </div>
          <div className="flex items-start mb-2 w-full">
            <CheckCircle2 className="min-w-[30px] min-h-[30px] text-white fill-[#313235] mr-1" />
            <p className="text-[18px]">Elite support for inquiries (guaranteed reply within 4 hours)</p>
          </div>
          <Link href="#" target="_blank">
            <button className="w-full h-[50px] px-4 bg-[#313235] text-white border border-[#313235] shadow rounded-lg cursor-pointer font-medium text-[18px] mt-6 hover:bg-[#971a1d] hover:border-[#971a1d] transition-colors">Signup</button>
          </Link>
        </div>
        {/* Biz Leader */}
        <div ref={microbusinessRef} className="bg-white rounded-[10px] mt-2 p-8 w-[320px] flex flex-col items-stretch">
          <p className="text-[24px] font-semibold text-center mb-5">Biz Leader</p>
          <p className="text-[30px] text-center mb-2">$TBD/month</p>
          <p className="text-[18px] mb-5">While this membership level is intended for businesses, organizations of all types and sizes can benefit from these service offerings.</p>
          <p className="text-[18px] font-semibold mb-5">Everything in Data Seeker and...</p>
          <div className="flex items-start mb-2 w-full">
            <CheckCircle2 className="min-w-[30px] min-h-[30px] text-white fill-[#313235] mr-1" />
            <p className="text-[18px]">Access to our elected officials & department leaders e-mail & phone address book</p>
          </div>
          <div className="flex items-start mb-2 w-full">
            <CheckCircle2 className="min-w-[30px] min-h-[30px] text-white fill-[#313235] mr-1" />
            <p className="text-[18px]">Full access to SMRC reviews and government responses for all zip codes<sup>*</sup></p>
          </div>
          <div className="flex items-start mb-2 w-full">
            <CheckCircle2 className="min-w-[30px] min-h-[30px] text-white fill-[#313235] mr-1" />
            <p className="text-[18px]">Premium support for inquiries (guaranteed reply within 8 hours)</p>
          </div>
          <div className="w-full mb-2">
            <p className="text-[12px]"><sup>*</sup> Restrictions apply</p>
          </div>
          <Link href="#" target="_blank">
            <button className="w-full h-[50px] px-4 bg-[#313235] text-white border border-[#313235] shadow rounded-lg cursor-pointer font-medium text-[18px] mt-6 hover:bg-[#971a1d] hover:border-[#971a1d] transition-colors">Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MembershipComparison;
