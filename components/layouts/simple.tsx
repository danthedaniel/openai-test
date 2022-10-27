import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <main className="p-4 container mx-auto">{children}</main>;
}
