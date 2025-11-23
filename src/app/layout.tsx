import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IntelliBiz - Multi-Agent Platform",
  description: "Unified platform for business intelligence agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
            {/* Premium Header with Glassmorphism */}
            <div className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-sm">
              <div className="px-6 py-4 flex items-center gap-4">
                <SidebarTrigger className="hover:bg-accent/50 transition-colors" />
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary via-purple-500 to-blue-500"></div>
                  <h1 className="font-bold text-xl bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    IntelliBiz Workspace
                  </h1>
                </div>
              </div>
            </div>

            {/* Content Area with Better Spacing */}
            <div className="p-8 max-w-[1800px] mx-auto">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
