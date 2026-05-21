import type { Metadata } from "next";
import { auth } from "@/auth";
import { AuthSessionProvider } from "@/src/components/layout/auth-session-provider";
import "./globals.css";
import "@/src/styles.css";

export const metadata: Metadata = {
  title: "AgencyOS",
  description:
    "Open-source operating system for consulting agencies, now migrating to a Next.js and Auth.js application shell.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
