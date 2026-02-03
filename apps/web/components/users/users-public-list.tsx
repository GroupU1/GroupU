"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function UsersPublicList({ className }: { className?: string }) {
  const users = useQuery(api.users.listUsersPublic) as PublicUser[] | undefined;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">View People</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>People</DialogTitle>
          <DialogDescription>Public profiles</DialogDescription>
        </DialogHeader>
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
              <ItemGroup className="gap-0">
                {users.map((user, i) => {
                  const name = getDisplayName(user);
                  const initials = getInitials(name);
                  return (
                    <div key={i}>
                      <Item variant="muted" size="sm">
                        <ItemMedia variant="image">
                          <Avatar>
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{name}</ItemTitle>
                          {user.bio ? (
                            <ItemDescription>{user.bio}</ItemDescription>
                          ) : null}
                        </ItemContent>
                        <ItemActions className="ml-auto flex flex-wrap gap-2">
                          {user.major ? (
                            <Badge variant="secondary">{user.major}</Badge>
                          ) : null}
                          {user.concentration ? (
                            <Badge variant="outline">
                              {user.concentration}
                            </Badge>
                          ) : null}
                          {user.collegeYear ? (
                            <Badge variant="outline">{user.collegeYear}</Badge>
                          ) : null}
                        </ItemActions>
                      </Item>
                      {i < users.length - 1 ? <ItemSeparator /> : null}
                    </div>
                  );
                })}
              </ItemGroup>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
