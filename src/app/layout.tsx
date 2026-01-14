import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ToastProvider from "@/app-components/ToastProvider";

import { AuthFlowProvider } from "@/context/auth-flow-context"; // Import Provider

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider />
          <AuthFlowProvider>
            <div className="flex min-h-screen">
              <main className="flex-1 bg-white">
                {children}
              </main>
            </div>
          </AuthFlowProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
