import React from "react";
import { cn } from "@/lib/utils";

export default function ContentContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "fixed bottom-16 left-0 w-screen h-[calc(100vh-4rem)] text-card-foreground rounded-none border-0 shadow-sm overflow-hidden bg-card md:w-[calc(100vw-8rem)] md:h-[calc(100vh-2rem)] md:ml-24 md:bottom-0 md:rounded-xl md:border",
        className,
      )}
    >
      {children}
    </div>
  );
}
