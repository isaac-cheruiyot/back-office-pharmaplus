import type React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { OrderProvider } from "@/context/OrderContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <OrderProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </OrderProvider>
  );
}
