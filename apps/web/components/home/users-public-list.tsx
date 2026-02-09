"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";

type PublicUser = {
  firstName?: string;
  lastName?: string;
  nickname?: string;
  collegeYear?: string;
  major?: string;
  minor?: string;
  concentration?: string;
  bio?: string;
};

function getDisplayName(user: PublicUser) {
  const named = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return named || user.nickname?.trim() || "Unnamed";
}

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return (parts[0] ?? "").slice(0, 2).toUpperCase();
  const firstInitial = parts[0]?.[0] ?? "";
  const lastInitial = parts[parts.length - 1]?.[0] ?? "";
  return `${firstInitial}${lastInitial}`.toUpperCase() || "?";
}

export default function UsersPublicList({ className }: { className?: string }) {
  const users = useQuery(api.users.listUsers) as PublicUser[] | undefined;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>People</CardTitle>
        <CardDescription>Public profiles</CardDescription>
      </CardHeader>
      <CardContent>
        {users === undefined ? (
          <p className="text-sm text-muted-foreground">Loading users…</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users found.</p>
        ) : (
          <ItemGroup className="space-y-1">
            {users.map((user, i) => {
              const name = getDisplayName(user);
              const initials = getInitials(name);
              return (
                <div key={i}>
                  <Item variant="muted" size="sm">
                    <ItemMedia variant="image">
                      <Avatar size="lg">
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{name}</ItemTitle>
                      <div className="flex flex-wrap gap-2">
                        {user.major ? <Badge>{user.major}</Badge> : null}
                        {user.minor ? (
                          <Badge variant="secondary">{user.minor}</Badge>
                        ) : null}
                        {user.concentration ? (
                          <Badge variant="outline">{user.concentration}</Badge>
                        ) : null}
                        {user.collegeYear ? (
                          <Badge variant="outline" className="capitalize">
                            {user.collegeYear}
                          </Badge>
                        ) : null}
                      </div>

                      {user.bio ? (
                        <ItemDescription>{user.bio}</ItemDescription>
                      ) : null}
                    </ItemContent>
                  </Item>
                </div>
              );
            })}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
}
