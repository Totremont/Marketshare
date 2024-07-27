import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 
  {
    template: 'Marketshare | %s',
    default: 'Marketshare',
  },
  description: 'Marketshare is a fictional B2B eCommerce website made as a personal programming project to learn web development and cloud deployment'
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) 
{
  return (
    
      <html lang="en">       
        <body className={inter.className + "touch-pan-x touch-pan-y h-dvh w-dvh"}>{children}</body>
      </html>
  );
}
