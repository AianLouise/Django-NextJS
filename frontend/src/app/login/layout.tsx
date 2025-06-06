import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | WorkTally",
  description: "Sign in to your WorkTally account",
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
