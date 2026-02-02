import { dms } from "./dm-data";
import React from "react";

export default function DmMessages({ user }: { user: string }) {
  const dm = dms.find((dm) => dm.user === user);

  return (
    <div>
      {dm?.messages.map((msg, i) => (
        <div
          key={i}
          className={`w-full my-2 flex ${msg.sentByMe ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`rounded-full text-sm px-3 py-1 ${msg.sentByMe ? "bg-foreground text-background" : "bg-muted"}`}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}
