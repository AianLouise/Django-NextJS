import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | TimeTrack",
  description: "Sign in to your TimeTrack account",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>{children}</div>
  );
}
