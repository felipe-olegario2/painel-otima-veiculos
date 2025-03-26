// app/layout.tsx
"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import "./globals.css"; // Tailwind global

import { Figtree, Inter } from "next/font/google";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${figtree.variable} ${inter.variable}`}>
      <body className={`min-h-screen ${figtree.className}`}>
        {/* SessionProvider precisa estar mais externo que tudo que depende de sessão */}
        <SessionProvider>
          <MantineProvider>
            <Notifications position="top-right" />
            {children}
          </MantineProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
