"use client";

import { useClerk, useUser } from "@clerk/nextjs";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRound } from "lucide-react";
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ProfileDetailsForm from "@/components/home/profile-details-form";

export default function ProfileButton() {
  const { user, isLoaded } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = React.useState(false);

  if (!isLoaded || !user) return null;

  return (
    <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="rounded-full">
            <Avatar size="lg">
              <AvatarFallback>
                <UserRound className="size-6" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                openUserProfile();
              }}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setIsProfileDialogOpen(true);
              }}
            >
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                signOut();
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="p-0 sm:max-w-2xl">
        <DialogTitle className="sr-only">Profile Details</DialogTitle>
        <ProfileDetailsForm />
      </DialogContent>
    </Dialog>
  );
}
