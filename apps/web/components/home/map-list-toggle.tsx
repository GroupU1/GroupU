"use client";

import { Button } from "@/components/ui/button";
import { List, Map } from "lucide-react";
import React from "react";

type MapListToggleProps = {
  isMap: boolean;
  onToggle: () => void;
};

export default function MapListToggle({ isMap, onToggle }: MapListToggleProps) {

  return (
    <Button size="icon-lg" variant="outline" onClick={onToggle}>
      {isMap ? <Map className="size-5" /> : <List className="size-5" />}
    </Button>
  );
}
