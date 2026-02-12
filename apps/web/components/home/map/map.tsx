"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../backend/convex/_generated/api";
import UserMapMarker from "@/components/home/map/user-map-marker";
import ActivityMapMarker from "@/components/home/map/activity-map-marker";
import UserPopover from "@/components/home/map/user-popover";

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
          <UserMapMarker
            key={user._id}
            user={user}
            status={status}
            ariaLabel={`User ${user.nickname ?? user.firstName ?? ""}`}
          />
        );
      })}
      {activityItems.map((activity) => (
        <ActivityMapMarker key={activity._id} title={activity.title} />
      ))}
    </div>
  );
}
