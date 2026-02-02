"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dms } from "./dm-data";

type DmListProps = {
  className?: string;
  chat: number;
  setChat: React.Dispatch<React.SetStateAction<number>>;
};

export default function DmList({ className, chat, setChat }: DmListProps) {
  return (
    <div className={className}>
      {dms.map((dm, i) => {
        return (
          <div key={dm.id}>
            {i > 0 && <Separator className="" />}
            <Button
              variant="ghost"
              className={`w-full h-full rounded-none flex gap-x-4 py-4 ${chat == dm.id && "bg-accent"}`}
              onClick={() => {
                setChat(dm.id);
              }}
            >
              <Avatar size="lg" className="flex-none mt-1">
                <AvatarFallback className="bg-foreground">
                  <UserRound className="text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{dm.user}</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    {dm.date}
                  </span>
                </div>
                <p className="text-sm text-left font-normal">
                  {dm.messages[0]?.text}
                </p>
              </div>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
