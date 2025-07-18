import DashboardNavbar from "@/components/dashboard-navbar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-6 md:px-6">{children}</main>
    </div>
  );
}
