import React from "react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Search, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DmMessageHeader({
  className,
  user,
}: {
  className?: string;
  user: string;
}) {
  return (
    <div
      className={`${className} flex justify-between absolute top-0 left-0 right-0 z-50`}
    >
      <Badge variant="outline" className="px-4 h-10 bg-card">
        <h2 className="font-medium text-lg">{user}</h2>
      </Badge>
      <ButtonGroup>
        <ButtonGroup>
          <Button className="bg-card border hover:bg-muted text-accent-foreground w-9 h-9">
            <Star />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button className="bg-card border hover:bg-muted text-accent-foreground w-9 h-9">
            <Search />
          </Button>
          <Button className="bg-card border hover:bg-muted text-accent-foreground w-9 h-9">
            <MoreHorizontal />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </div>
  );
}
