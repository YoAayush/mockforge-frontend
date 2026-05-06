import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/lib/userProvider";
import { ThemeProvider } from "@/lib/theme-provider";
// import ThemeProvider

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "MockForge - API Schema & Mock Server Platform",
  description:
    "A full-stack developer tool to design API schemas, generate mock endpoints, and manage public/private APIs with authentication and role-based access. MockForge is a powerful platform for designing API schemas and generating mock servers. Create, test, and iterate on your APIs with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function() {
            const theme = localStorage.getItem('theme');
            if (theme) {
              document.documentElement.setAttribute('data-theme', theme);
            } else {
              document.documentElement.setAttribute('data-theme', 'dark');
            }
          })();
        `,
          }}
        />
      </head>

      {/* This script runs before React hydration to set the initial theme based on localStorage */}
      {/* <script
        dangerouslySetInnerHTML={{
          __html: `
      (function() {
        const theme = localStorage.getItem('theme');
        if (theme) {
          document.documentElement.setAttribute('data-theme', theme);
        }
      })();
    `,
        }}
      /> */}

      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className="font-serif antialiased"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          themes={["light", "dark", "system"]}
          storageKey="theme"
          enableSystem={true}
        >
          <UserProvider>{children}</UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
