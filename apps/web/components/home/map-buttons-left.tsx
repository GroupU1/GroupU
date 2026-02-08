import MapListToggle from "@/components/home/map-list-toggle";
import SetStatus from "@/components/home/set-status";
import VisibilitySwitch from "@/components/home/visibility-switch";
import { ButtonGroup } from "@/components/ui/button-group";
import React from "react";

export default function MapButtonsLeft() {
  return (
    <ButtonGroup className="flex flex-col-reverse md:flex-row space-2">
      <ButtonGroup>
        <MapListToggle />
        <VisibilitySwitch />
      </ButtonGroup>
      <ButtonGroup>
        <SetStatus />
      </ButtonGroup>
    </ButtonGroup>
  );
}
