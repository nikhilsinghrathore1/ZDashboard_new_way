import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Import your new provider
import { Web3Provider } from "./providers"; 
import SideNavbar from "./components/SideNavbar";
import TopNavbar from "./components/TopNavbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZeroLag Market Place",
  description: "Earn through your Agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
       {/*
          The provider should wrap the entire part of the UI 
          that needs access to the wallet state.
        */}
        <Web3Provider>
          <div className="w-full h-screen overflow-hidden bg-[#020817] flex">
            <SideNavbar />

            <div className="w-[83.35%] h-full overflow-y-auto ">
              {/* Now TopNavbar is inside the provider and will work */}
              <TopNavbar /> 
              {children}
            </div>
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}