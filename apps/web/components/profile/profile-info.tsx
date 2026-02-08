"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import React from "react";

export type ProfileInfoData = {
  firstName?: string;
  lastName?: string;
  nickname?: string;
  collegeYear?: string;
  major?: string;
  minor?: string;
  concentration?: string;
  bio?: string;
  visibility: "public" | "friends" | "private";
  location?: {
    lat: number;
    lng: number;
  };
};

export default function ProfileInfo({ profile }: { profile: ProfileInfoData }) {
  const { signOut } = useClerk();
  const { user } = useUser();

  const fullName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="grid grid-cols-[auto_1fr]">
      <div className="flex justify-center h-16 pr-4">
        <Avatar className="w-16 h-16">
          <AvatarFallback>
            <UserRound className="size-8" />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col h-16 justify-center">
          <div className="text-lg font-semibold">
            {fullName || profile.nickname || "Profile"}
          </div>
          {profile.nickname && (
            <div className="text-sm text-muted-foreground">
              @{profile.nickname}
            </div>
          )}
        </div>

        <div className="grid gap-3 text-sm">
          <ProfileRow label="First name" value={profile.firstName} />
          <ProfileRow label="Last name" value={profile.lastName} />
          <ProfileRow label="Nickname" value={profile.nickname} />
          <ProfileRow label="College year" value={profile.collegeYear} />
          <ProfileRow label="Major" value={profile.major} />
          <ProfileRow label="Minor" value={profile.minor} />
          <ProfileRow label="Concentration" value={profile.concentration} />
          <ProfileRow label="Bio" value={profile.bio} />
          <ProfileRow label="Visibility" value={profile.visibility} />
          <ProfileRow
            label="Location"
            value={
              profile.location
                ? `${profile.location.lat}, ${profile.location.lng}`
                : undefined
            }
          />
        </div>

        <div className="mt-8">
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              signOut();
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-start gap-2">
      <div className="text-muted-foreground">{label}</div>
      <div>{value ?? "—"}</div>
    </div>
  );
}
