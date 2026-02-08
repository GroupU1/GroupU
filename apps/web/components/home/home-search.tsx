"use client";

import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import HomeSearchFilter from "./home-search-filter";
import { cn } from "@/lib/utils";

export default function HomeSearch({ className }: { className?: string }) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!isMobileOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  React.useEffect(() => {
    if (isMobileOpen) {
      inputRef.current?.focus();
    }
  }, [isMobileOpen]);

  return (
    <div className={className}>
      <div className="md:hidden">
        <div
          ref={wrapperRef}
          className={cn(
            "relative h-10 transition-all duration-200 ease-out",
            isMobileOpen ? "w-64" : "w-10",
          )}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileOpen(true)}
            className={cn(
              "absolute inset-0 h-10 w-10",
              isMobileOpen ? "opacity-0 pointer-events-none" : "opacity-100",
            )}
            aria-label="Open search"
          >
            <Search className="size-5" />
          </Button>
          <InputGroup
            className={cn(
              "absolute inset-0 w-full transition-opacity duration-200 h-10",
              isMobileOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none",
            )}
          >
            <InputGroupInput ref={inputRef} placeholder="People or tags" />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <HomeSearchFilter />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      <div className="hidden md:block">
        <InputGroup className="w-80 h-10">
          <InputGroupInput placeholder="People or tags" />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <HomeSearchFilter />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}
