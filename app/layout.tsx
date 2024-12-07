// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/app/context/AppContext"; // Import your context provider

export const metadata: Metadata = {
  title: "Dizely Calendar",
  description:
    "Welcome to my Dizely Calendar! Visit my application and see what I have to offer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider> {/* Wrap children with the AppProvider */}
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
