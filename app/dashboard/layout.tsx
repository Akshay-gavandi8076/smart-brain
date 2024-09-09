"use client";

import { useState } from "react";

import Sidebar from "./side-nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex h-screen flex-row justify-start">
      <aside className="flex-none transition-all duration-300 ease-in-out">
        <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      </aside>
      <main
        className={`flex-1 overflow-auto p-4 transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? "ml-52" : "ml-16"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
