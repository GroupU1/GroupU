import React from "react";
import { Button } from "@/components/ui/button";
import {
  CircleUserRound,
  Home,
  MessageCircle,
  UserRound,
  Waypoints,
} from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="z-100 fixed bottom-0 left-0 right-0 h-16 flex flex-row justify-around items-center gap-x-6 p-4 bg-card border-t shadow-sm md:h-auto md:top-0 md:left-0 md:right-auto md:bottom-auto md:flex-col md:gap-y-4 md:m-6 md:p-0 md:bg-transparent md:border-0 md:shadow-none">
      <div className="text-center">
        <Button asChild variant="ghost" size="icon-lg" className="p-0">
          <Link href="/home" aria-label="Home">
            <Home className="size-6" />
          </Link>
        </Button>
        <p className="hidden md:block">Home</p>
      </div>
      <div className="text-center">
        <Button variant="ghost" size="icon-lg" className="p-0">
          <Waypoints className="size-6" />
        </Button>
        <p className="hidden md:block">Plans</p>
      </div>
      <div className="text-center">
        <Button asChild variant="ghost" size="icon-lg" className="p-0">
          <Link href="/dms" aria-label="DM's">
            <MessageCircle className="size-6" />
          </Link>
        </Button>
        <p className="hidden md:block">DMs</p>
      </div>
      <div className="text-center">
        <Button asChild variant="ghost" size="icon-lg" className="p-0">
          <Link href="/profile" aria-label="Profile">
            <CircleUserRound className="size-6" />
          </Link>
        </Button>
        <p className="hidden md:block">Profile</p>
      </div>
    </div>
  );
}
