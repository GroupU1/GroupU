"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Plus } from "lucide-react";
import { useMutation } from "convex/react";
import React, { useState } from "react";
import { api } from "../../../backend/convex/_generated/api";
import HourMinuteInput from "@/components/home/hour-minute-input";

export default function AddActivity({ className }: { className?: string }) {
  const createActivity = useMutation(api.activity.createActivity);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [timeEnabled, setTimeEnabled] = useState(true);
  const [time, setTime] = useState<Date | undefined>(new Date());
  const [maxSizeEnabled, setMaxSizeEnabled] = useState(true);
  const [maxSize, setMaxSize] = useState("10");
  const [byApproval, setByApproval] = useState("false");
  const [durationHours, setDurationHours] = useState("3");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocationDetails("");
    setTimeEnabled(true);
    setTime(new Date());
    setMaxSizeEnabled(true);
    setMaxSize("10");
    setByApproval("false");
    setDurationHours("3");
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const maxSizeNumber = Number(maxSize);
    const hours = Number(durationHours);
    const parsedTime = timeEnabled && time ? time.getTime() : undefined;

    if (
      !title.trim() ||
      (maxSizeEnabled &&
        (Number.isNaN(maxSizeNumber) ||
          maxSizeNumber < 0 ||
          maxSizeNumber > 20)) ||
      Number.isNaN(hours)
    ) {
      setError("Please fill out all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const baseTime = timeEnabled && time ? time.getTime() : Date.now();
      const expirationTime = baseTime + hours * 60 * 60 * 1000;

      await createActivity({
        title: title.trim(),
        description: description.trim() ? description.trim() : undefined,
        location: { lat: 0, lng: 0 },
        locationDetails: locationDetails.trim()
          ? locationDetails.trim()
          : undefined,
        time: parsedTime,
        maxSize: maxSizeEnabled ? maxSizeNumber : undefined,
        byApproval: byApproval === "true",
        expirationTime,
      });

      setOpen(false);
      resetForm();
    } catch (err) {
      setError("Unable to create activity. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={className}>
        <Button size="icon-lg" className="rounded-full w-12 h-12">
          <Plus className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create Activity
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="activity-title">Title</FieldLabel>
                <Input
                  id="activity-title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Study session"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="activity-description">
                  Description
                </FieldLabel>
                <Textarea
                  id="activity-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What are you planning to do?"
                  className="resize-none max-h-14"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="activity-location-details">
                  Location details
                </FieldLabel>
                <div className="grid grid-cols-[auto_1fr] gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-full w-10"
                  >
                    <MapPin className="size-5" />
                  </Button>
                  <Textarea
                    id="activity-location-details"
                    value={locationDetails}
                    onChange={(event) => setLocationDetails(event.target.value)}
                    placeholder="Room 204, Main Library"
                    className="resize-none max-h-14"
                  />
                </div>
              </Field>
              <div className="grid gap-3 md:grid-cols-2 -mb-4">
                <Field>
                  <FieldLabel htmlFor="activity-time">Time</FieldLabel>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={timeEnabled}
                      onCheckedChange={(checked) => {
                        const nextEnabled = Boolean(checked);
                        setTimeEnabled(nextEnabled);
                        if (!nextEnabled) {
                          setTime(undefined);
                        }
                      }}
                      aria-label="Enable time"
                    />
                    <HourMinuteInput
                      value={time}
                      onChange={setTime}
                      buttonText={timeEnabled ? undefined : "Open ended"}
                      disabled={!timeEnabled}
                      className="flex-1"
                    />
                  </div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="activity-duration">Duration</FieldLabel>
                  <Select
                    value={durationHours}
                    onValueChange={setDurationHours}
                  >
                    <SelectTrigger id="activity-duration">
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
                </Field>
              </div>
              <FieldDescription>
                Activities will automatically expire after their duration has
                passed.
              </FieldDescription>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="activity-max-size">Max size</FieldLabel>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={maxSizeEnabled}
                      onCheckedChange={(checked) => {
                        const nextEnabled = Boolean(checked);
                        setMaxSizeEnabled(nextEnabled);
                        if (!nextEnabled) {
                          setMaxSize("");
                        }
                      }}
                      aria-label="Enable max size"
                    />
                    <Input
                      id="activity-max-size"
                      type="number"
                      min={0}
                      max={20}
                      value={maxSizeEnabled ? maxSize : ""}
                      onChange={(event) => setMaxSize(event.target.value)}
                      disabled={!maxSizeEnabled}
                      placeholder={maxSizeEnabled ? "Max 20" : "No limit"}
                    />
                  </div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="activity-approval">
                    Join approval
                  </FieldLabel>
                  <Select value={byApproval} onValueChange={setByApproval}>
                    <SelectTrigger id="activity-approval">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="false">Open</SelectItem>
                        <SelectItem value="true">By approval</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
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
            <Button type="submit" disabled={isSubmitting || !title.trim()}>
              {isSubmitting ? "Creating…" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
