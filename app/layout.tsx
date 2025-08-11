import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
        <div className="w-full h-screen overflow-hidden bg-[#020817] flex">
          <SideNavbar />

          <div className="w-[83.35%] h-full relative overflow-y-auto ">
            <TopNavbar />
                    
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
