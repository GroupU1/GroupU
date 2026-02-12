import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dot,
  MessageCircle,
  MoreHorizontal,
  UserPlus,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { api } from "../../../../backend/convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Doc } from "../../../../backend/convex/_generated/dataModel";
import Timer from "@/components/home/map/timer";

type ListedUser = FunctionReturnType<typeof api.users.listUsers>[number];
type Status = Doc<"statuses">;

export default function UserPopover({
  user,
  status,
}: {
  user: ListedUser;
  status?: Status;
}) {
  return (
    <div className="w-80 space-y-4">
      <div className="w-full flex justify-between">
        <div className="flex flex-row items-center gap-x-4">
          <Avatar className="relative size-16 overflow-visible">
            <AvatarFallback>
              <UserRound className="size-6" />
            </AvatarFallback>
            {/* {status && (
              <div className="absolute bottom-full left-1/2 z-50 -mb-1 w-max max-w-22 -translate-x-1/2 rounded-md bg-primary px-2 py-1 text-center text-xs text-primary-foreground shadow-md whitespace-normal leading-[0.78rem] line-clamp-3">
                {status.text}
              </div>
            )} */}
          </Avatar>
          <div className="flex flex-col gap-y-0.5">
            <div className="flex items-center">
              <h2 className="font-semibold">
                {user.nickname ? user.nickname : user.firstName + " " + user.lastName}
              </h2>
              {user.nickname && (
                <Dot className="size-4 text-muted-foreground" />
              )}
              {user.nickname && (
                <p className="text-sm text-muted-foreground">he/him</p>
              )}
            </div>
            {status && (
              <div className="flex flex-col">
                <div className="text-sm text-muted-foreground -mb-0.5 line-clamp-1">
                  {status.text}
                </div>
                <Timer
                  expirationTime={status.expirationTime}
                  size="sm"
                  showExpiresText
                  className="text-muted-foreground/70"
                />
              </div>
            )}
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>View Profile</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Restrict User</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  Block User
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="space-y-4">
        {/* <div className="w-full">
          <p className="mb-1">Activities</p>
          <div className="flex flex-col gap-y-1">
            <Button
              variant="secondary"
              className="w-full justify-start text-sm rounded-sm"
            >
              Studying Calc III
            </Button>
            <p className="w-full text-center text-muted-foreground -mt-3">...</p>
            <div className="w-full text-center text-muted-foreground text-sm bg-muted/50 rounded-sm p-1">
              None...
            </div>
          </div>
        </div> */}
        <div className="flex justify-end gap-x-2">
          <Button variant="outline" size="icon" className="flex-1">
            <MessageCircle className="size-5" />
          </Button>
          <Button variant="outline" size="icon" className="flex-1">
            <UserPlus className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
