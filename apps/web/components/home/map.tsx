"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Target, UserRound } from "lucide-react";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";
import { Badge } from "@/components/ui/badge";

export default function Map({ className }: { className?: string }) {
  const users = useQuery(api.users.listUsers);
  const activities = useQuery(api.activity.listActivities);
  const statuses = useQuery(api.statuses.listStatuses);

  const userItems = users ?? [];
  const activityItems = activities ?? [];
  const statusItems = statuses ?? [];
  const statusByUserId = new globalThis.Map(
    statusItems.map((status) => [status.userId, status]),
  );

  return (
    <div
      className={cn(
        "flex flex-wrap justify-around items-center gap-2",
        className,
      )}
    >
      {userItems.map((user) => {
        const status = statusByUserId.get(user._id);

        return (
          <Button
            key={user._id}
            variant="outline"
            size="icon-lg"
            aria-label={`User ${user.nickname ?? user.firstName ?? ""}`}
            className="rounded-full relative"
          >
            <UserRound className="size-5" />
            {status?.text ? (
              <Badge className="absolute -top-8 left-1/2 -translate-x-1/2">
                {status.text}
              </Badge>
            ) : null}
          </Button>
        );
      })}
      {activityItems.map((activity) => (
        <Button
          key={activity._id}
          variant="outline"
          size="icon-lg"
          aria-label={`Activity ${activity.title ?? ""}`}
          className="relative"
        >
          <Target className="size-5" />
          <Badge className="absolute -top-8 left-1/2 -translate-x-1/2">
            {activity.title}
          </Badge>
        </Button>
      ))}
    </div>
  );
}
