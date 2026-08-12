"use client";


import { AuthProvider } from "../components/AuthProvider";
import BodyClass from "../components/BodyClass";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return <>
  <BodyClass className="vertical light" />
  <AuthProvider>
  {children}
  </AuthProvider>
  </>;
}