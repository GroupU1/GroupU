"use client";

import { Button } from "@/components/ui/button";
import { List, Map } from "lucide-react";
import React from "react";

export default function MapListToggle() {
  const [map, setMap] = React.useState(true);

  return (
    <Button
      size="icon-lg"
      variant="outline"
      onClick={() => setMap((prev) => !prev)}
    >
      {map ? <Map className="size-5" /> : <List className="size-5" />}
    </Button>
  );
}
