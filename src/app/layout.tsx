// app/admin/layout.tsx
"use client";

import { Container, MantineProvider } from "@mantine/core";
import { createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import "./globals.css";
import { Notifications } from "@mantine/notifications";
import { Figtree, Inter } from "next/font/google";
import AdminSidebar from "@/components/Sidebar";
import { useAuth } from "../hooks/useAuth";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isLogged } = useAuth();

  return (
    <html lang="pt-BR" className={`${figtree.variable} ${inter.variable}`}>
      <body className={`min-h-screen flex ${figtree.className}`}>
        <MantineProvider>
          <Notifications position="top-right" />
          {isLogged && <AdminSidebar />}
          <main className="flex-1 bg-gray-50 p-6 overflow-auto">
            <Container fluid>{children}</Container>
          </main>
        </MantineProvider>
      </body>
    </html>
  );
}
