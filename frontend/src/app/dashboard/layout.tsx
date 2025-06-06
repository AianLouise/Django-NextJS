import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | WorkTally",
  description: "WorkTally employee dashboard for tracking work hours and managing your time",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>{children}</div>
  );
}
