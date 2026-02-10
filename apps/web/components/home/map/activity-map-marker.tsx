import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import React from "react";

export default function ActivityMapMarker({ title }: { title?: string }) {
  return (
    <Button
      variant="outline"
      size="icon-lg"
      aria-label={`Activity ${title ?? ""}`}
      className="relative"
    >
      <Target className="size-5" />
      <Badge className="absolute -top-8 left-1/2 -translate-x-1/2">
        {title}
      </Badge>
    </Button>
  );
}
