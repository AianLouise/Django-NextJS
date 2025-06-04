import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | TimeTrack",
  description: "Create a new account for TimeTrack time tracking system",
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
