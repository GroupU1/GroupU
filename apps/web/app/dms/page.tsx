"use client";

import { dms } from "@/components/dms/dm-data";
import DmList from "@/components/dms/dm-list";
import DmMessageHeader from "@/components/dms/dm-message-header";
import DmMessageInput from "@/components/dms/dm-message-input";
import DmMessages from "@/components/dms/dm-messages";
import DmTitleDropdown from "@/components/dms/dm-title-dropdown";
import Navbar from "@/components/home/navbar";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Search } from "lucide-react";
import React from "react";

export default function Page() {
  const [chat, setChat] = React.useState<number>(1);

  const inputWrapRef = React.useRef<HTMLDivElement | null>(null);
  const [inputH, setInputH] = React.useState<number>(0);

  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const dm = dms.find((dm) => dm.id === chat);

  const composerStyle = {
    "--composer-h": `${inputH}px`,
  } as React.CSSProperties;

  React.useLayoutEffect(() => {
    const el = inputWrapRef?.current;
    if (!el) return;

    const update = () => setInputH(el.getBoundingClientRect().height);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  const scrollToBottom = () => {
    const viewport = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLDivElement | null;

    if (!viewport) return;

    viewport.scrollTop = viewport.scrollHeight;
  };

  React.useLayoutEffect(() => {
    scrollToBottom();
  }, [chat]);

  React.useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      scrollToBottom();
    });

    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 w-[calc(100vw-8rem)] h-[calc(100vh-2rem)] ml-24 grid grid-cols-3
                    text-card-foreground rounded-xl border shadow-sm overflow-hidden"
    >
      <div className="col-span-1 border-r bg-card p-4 space-y-2">
        <div className="flex justify-between -mx-2">
          <DmTitleDropdown />
          <Button variant="ghost" size="icon">
            <Edit />
          </Button>
        </div>
        <InputGroup>
          <InputGroupInput placeholder="Find a DM"></InputGroupInput>
          <InputGroupAddon align="inline-end">
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <DmList className="mt-8" chat={chat} setChat={setChat} />
      </div>
      <div
        className="col-span-2 bg-card/50 relative h-full min-h-0"
        style={composerStyle}
      >
        <DmMessageHeader className="p-4" user={dm?.user ?? ""} />

        <ScrollArea
          ref={scrollRef}
          className="absolute inset-0 h-full w-full z-0"
        >
          <div className="h-full w-full px-4 pt-16 pb-(--composer-h)">
            <DmMessages user={dm?.user ?? ""} />
          </div>
        </ScrollArea>

        <div
          ref={inputWrapRef}
          className="absolute bottom-0 left-0 right-0 p-4"
        >
          <DmMessageInput className="w-full mx-auto" />
        </div>
      </div>
      <Navbar/>
    </div>
  );
}
