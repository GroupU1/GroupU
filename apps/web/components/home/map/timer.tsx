import React from "react";

import { Timer as TimerIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function formatExpirationTime(expirationTime: number): string {
  const msLeft = Math.max(0, expirationTime - Date.now());
  const minutesLeft = Math.ceil(msLeft / 60000);

  if (minutesLeft >= 60) {
    const hoursLeft = Math.floor(minutesLeft / 60);
    return `${hoursLeft}h`;
  }

  return `${Math.max(1, minutesLeft)}m`;
}

interface TimerParams {
  expirationTime: number;
  size?: "default" | "sm" | "lg";
  showExpiresText?: boolean;
  className?: string;
}

export default function Timer({
  size = "default",
  expirationTime,
  showExpiresText = false,
  className,
}: TimerParams) {
  return (
    <div
      className={cn(
        className,
        `relative flex gap-x-[0.1rem] ${size === "sm" ? "text-xs" : size === "lg" ? "text-md" : "text-sm"}`,
      )}
    >
      <span>
        {showExpiresText && <span>expires </span>}
        <span>{formatExpirationTime(expirationTime)}</span>
      </span>
      <TimerIcon
        className={`relative top-[0.275rem] 
                    ${size === "sm" ? "size-2" : size === "lg" ? "size-4" : "size-3"}`}
      />
    </div>
  );
}
