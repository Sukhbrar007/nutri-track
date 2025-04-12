import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import LoadingBar from "@/components/LoadingBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NutriTracker - Track Your Nutrition Journey",
  description:
    "Track your daily nutrition, calories, and macros with NutriTracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <LoadingBar />
          <Header />
          <Suspense fallback={<Loading />}>
            <main className="flex-grow" suppressHydrationWarning={true}>
              {children}
            </main>
          </Suspense>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
