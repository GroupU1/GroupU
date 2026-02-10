import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import React from "react";

export default function UserMapMarker({
  status,
  ariaLabel,
}: {
  status?: string;
  ariaLabel: string;
}) {
  return (
    <Button
      variant="outline"
      size="icon-lg"
      aria-label={ariaLabel}
      className="rounded-full relative"
    >
      <UserRound className="size-5" />
      {status && status.length > 0 ? (
        <Badge className="absolute -top-8 left-1/2 -translate-x-1/2">
          {status}
        </Badge>
      ) : null}
    </Button>
  );
}
