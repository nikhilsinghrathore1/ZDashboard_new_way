"use client"; // This component is client-side

import { Providers } from "../Providers" // Adjust path if needed
import SideNavbar from "./SideNavbar";
import TopNavbar from "./TopNavbar";
import { BlockchainListener } from  "./BlockchainListner"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    // The Provider component must wrap your entire layout
    <>
      {/* The BlockchainListener can live here, active for all pages */}
      <BlockchainListener />
      
      <div className="w-full h-screen overflow-hidden bg-[#020817] flex">
        <div className="lg:w-[16.65%] w-[0%] hidden lg:block  h-full relative z-[1000000]">

        <SideNavbar />
        </div>

        <div className="lg:w-[83.35%] w-[100%]  h-full relative overflow-y-auto ">
          <TopNavbar />
          {children}
        </div>
      </div>
    </>
  );
}