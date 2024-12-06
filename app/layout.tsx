import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "Dizely Calender",
  description: "welcome to my dizely calender visit my application and see what i have to offer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
       
      >
        {children}
      </body>
    </html>
  );
}
