import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/Provider";
import QueryProvider from "@/react_query/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "shorter",
  description: "A URL Shortener inspired by IPFS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <QueryProvider>{children}</QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
