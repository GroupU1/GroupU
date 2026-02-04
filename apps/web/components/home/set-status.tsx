"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../backend/convex/_generated/api";

export default function SetStatus() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const setStatus = useMutation(api.statuses.setStatus);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [durationHours, setDurationHours] = useState("3");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const hours = Number(durationHours);
      const expirationTime = Date.now() + hours * 60 * 60 * 1000;
      await setStatus({
        userId: currentUser._id,
        text: text.trim(),
        expirationTime,
      });
      setOpen(false);
      setText("");
      setDurationHours("3");
    } catch (err) {
      setError("Unable to set your status. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed top-0 right-0 flex flex-col">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="m-6">
            Set Status
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Status</DialogTitle>
            <DialogDescription>Share what you’re up to!</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="status-text">Status</FieldLabel>
                  <Input
                    id="status-text"
                    type="text"
                    placeholder="Studying..."
                    value={text}
                    maxLength={50}
                    onChange={(event) => setText(event.target.value)}
                  />
                  <p
                    className={`text-xs ${
                      text.length >= 50
                        ? "text-destructive/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {text.length} / 50
                  </p>
                </Field>
                <Field>
                  <FieldLabel htmlFor="status-duration">Duration</FieldLabel>
                  <Select
                    defaultValue="3"
                    value={durationHours}
                    onValueChange={setDurationHours}
                  >
                    <SelectTrigger id="status-duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Statuses will expire automatically.
                  </FieldDescription>
                </Field>
                {error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : null}
              </FieldGroup>
            </FieldSet>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  currentUser === undefined ||
                  !currentUser ||
                  text.trim().length === 0
                }
              >
                {isSubmitting ? "Posting…" : "Post"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
