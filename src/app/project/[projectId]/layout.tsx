import { Loader } from "lucide-react";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <React.Suspense
        fallback={
          <div className="fixed top-0 left-0 flex justify-center items-center w-full min-h-screen">
            <span className="text-sm text-foreground/60">Loading</span>
            <Loader className="animate-spin" />
          </div>
        }
      >
        {children}
      </React.Suspense>
    </>
  );
}
