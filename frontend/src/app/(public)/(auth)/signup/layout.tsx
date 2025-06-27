import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | WorkTally",
  description: "Create a new account for WorkTally time tracking system",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>{children}</div>
  );
}
