import UserPopover from "@/components/home/map/user-popover";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import React from "react";
import { api } from "../../../../backend/convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Doc } from "../../../../backend/convex/_generated/dataModel";

type ListedUser = FunctionReturnType<typeof api.users.listUsers>[number];
type Status = Doc<"statuses">;

export default function UserMapMarker({
  user,
  status,
  ariaLabel,
}: {
  user: ListedUser;
  status?: Status;
  ariaLabel: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon-lg"
          aria-label={ariaLabel}
          className="rounded-full relative"
        >
          <UserRound className="size-5" />
          {status ? (
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-max max-w-32
                         rounded-md bg-primary px-2 py-1 shadow-md whitespace-normal text-center leading-[0.92rem] text-xs text-primary-foreground"
            >
              {status.text}
            </div>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" sideOffset={4}>
        <UserPopover user={user} status={status} />
      </PopoverContent>
    </Popover>
  );
}
