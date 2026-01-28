"use client";

// AuthFlowProvider is now in RootLayout
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
