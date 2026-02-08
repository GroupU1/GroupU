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
        "fixed bottom-0 left-0 w-screen h-screen pb-16 text-card-foreground rounded-none border-0 shadow-sm overflow-hidden bg-card md:w-[calc(100vw-8rem)] md:h-[calc(100vh-2rem)] md:ml-24 md:pb-0 md:rounded-xl md:border",
        className,
      )}
    >
      {children}
    </div>
  );
}
