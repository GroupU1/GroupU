"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Globe, HatGlasses, UsersRound } from "lucide-react";
import React from "react";

export default function VisibilitySwitch() {
  const options = [
    { value: "public", label: "Public", Icon: Globe },
    { value: "friends", label: "Friends", Icon: UsersRound },
    { value: "private", label: "Private", Icon: HatGlasses },
  ] as const;

  type VisibilityValue = (typeof options)[number]["value"];

  const [value, setValue] = React.useState<VisibilityValue>("public");
  const currentIndex = options.findIndex((option) => option.value === value);
  const current = options[currentIndex] ?? options[0];

  const handleToggle = () => {
    const nextIndex = (currentIndex + 1) % options.length;
    setValue(options[nextIndex]!.value);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon-lg"
          variant="outline"
          onClick={handleToggle}
          aria-label={`Visibility: ${current.label}`}
        >
          <current.Icon className="size-5"/>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{current.label}</TooltipContent>
    </Tooltip>
  );
}
