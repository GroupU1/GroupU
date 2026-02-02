import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  List,
  ListOrdered,
  Code,
  Code2,
  Plus,
  Smile,
  AtSign,
  Mic,
  Video,
  Send,
  ChevronDown,
} from "lucide-react";

export default function DmMessageInput({ className }: { className?: string }) {
  return (
    <div className={className}>
      <TooltipProvider>
        <div className="rounded-xl border bg-card p-2">
          {/* Top toolbar */}
          <div className="flex items-center gap-1">
            {[
              { icon: <Bold className="h-4 w-4" />, label: "Bold" },
              { icon: <Italic className="h-4 w-4" />, label: "Italic" },
              { icon: <Underline className="h-4 w-4" />, label: "Underline" },
              {
                icon: <Strikethrough className="h-4 w-4" />,
                label: "Strikethrough",
              },
            ].map((b, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {b.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{b.label}</TooltipContent>
              </Tooltip>
            ))}

            <Separator orientation="vertical" className="mx-1 h-5! w-px" />

            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LinkIcon className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-5! w-px" />

            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <List className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-5! w-px" />

            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Code className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Code2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-full px-2 pt-2">
            <Textarea
              placeholder="Message..."
              className="min-h-4 resize-none border-0 bg-transparent! p-0 focus-visible:ring-0 rounded-none"
            />
          </div>

          {/* Bottom row */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Smile className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <AtSign className="h-5 w-5" />
              </Button>

              <Separator orientation="vertical" className="mx-1 h-5! w-px" />

              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Mic className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button size="icon" className="h-9 w-9">
                <Send className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Send now</DropdownMenuItem>
                  <DropdownMenuItem>Schedule send</DropdownMenuItem>
                  <DropdownMenuItem>Send silently</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
