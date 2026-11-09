import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Day Board",
  description: "Your calendar, email and to-dos on one page",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          {session && <Sidebar userName={session.user?.name ?? ""} userImage={session.user?.image ?? ""} />}
          <main className="flex-1 p-6 max-w-6xl mx-auto w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
