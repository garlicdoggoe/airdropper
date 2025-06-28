import type { Metadata } from "next";
import "./globals.css";
import { type ReactNode } from "react";
import { Providers } from "../provider/providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Airdropper",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <Header />
          <main>
            {props.children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
