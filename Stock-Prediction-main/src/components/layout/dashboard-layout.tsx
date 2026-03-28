"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#060B14] text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
