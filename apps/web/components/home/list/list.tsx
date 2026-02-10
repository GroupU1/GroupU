import { cn } from "@/lib/utils";
import React from "react";

export default function List({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex justify-center items-center text-muted-foreground",
        className,
      )}
    >
      List
    </div>
  );
}
