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
        <div className="w-[16.65%] h-full relative z-[1000000]">

        <SideNavbar />
        </div>

        <div className="w-[83.35%] h-full relative overflow-y-auto ">
          <TopNavbar />
          {children}
        </div>
      </div>
    </>
  );
}