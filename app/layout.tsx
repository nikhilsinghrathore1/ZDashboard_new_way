import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers"; // <-- IMPORT IT
import ClientLayout from "./components/ClientLayout"; // <-- IMPORT YOUR NEW COMPONENT
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
       {/* Use the new ClientLayout to wrap the children */}
          <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>      </body>
    </html>
  );
}