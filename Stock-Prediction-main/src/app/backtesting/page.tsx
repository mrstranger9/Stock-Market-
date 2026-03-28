import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import BacktestingClient from "./backtesting-client";

export default function BacktestingPage() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <BacktestingClient />
      </div>
    </DashboardLayout>
  );
}
