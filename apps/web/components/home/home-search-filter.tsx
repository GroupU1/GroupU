"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function HomeSearchFilter() {
  const [friends, setFriends] = React.useState(false);
  const [publicFilter, setPublicFilter] = React.useState(false);
  const [downNow, setDownNow] = React.useState(false);
  const [studying, setStudying] = React.useState(false);
  const [hosting, setHosting] = React.useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-7 h-7">
          <Filter className="s-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-sm text-muted-foreground">
            Filter Search
          </DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={friends}
            onCheckedChange={setFriends}
            onSelect={(e) => e.preventDefault()}
          >
            Friends
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={publicFilter}
            onCheckedChange={setPublicFilter}
            onSelect={(e) => e.preventDefault()}
          >
            Public
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={downNow}
            onCheckedChange={setDownNow}
            onSelect={(e) => e.preventDefault()}
          >
            Down Now
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={studying}
            onCheckedChange={setStudying}
            onSelect={(e) => e.preventDefault()}
          >
            Studying
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={hosting}
            onCheckedChange={setHosting}
            onSelect={(e) => e.preventDefault()}
          >
            Hosting
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
