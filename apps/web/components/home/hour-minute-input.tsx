"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const isPm = hours >= 12;
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${String(minutes).padStart(2, "0")} ${
    isPm ? "PM" : "AM"
  }`;
};

const to12Hour = (date: Date) => {
  const hours = date.getHours();
  return {
    hour: hours % 12 === 0 ? 12 : hours % 12,
    minute: date.getMinutes(),
    period: hours >= 12 ? "PM" : "AM",
  } as const;
};

const apply12Hour = (
  date: Date,
  hour: number,
  minute: number,
  period: string,
) => {
  const normalizedHour = Math.min(Math.max(hour, 1), 12);
  const normalizedMinute = Math.min(Math.max(minute, 0), 59);
  const isPm = period === "PM";
  const hour24 = (normalizedHour % 12) + (isPm ? 12 : 0);
  const next = new Date(date);
  next.setHours(hour24, normalizedMinute, 0, 0);
  return next;
};

type HourMinuteInputProps = {
  value?: Date;
  onChange?: (value: Date) => void;
  buttonText?: string;
  disabled?: boolean;
  className?: string;
};

export default function HourMinuteInput({
  value,
  onChange,
  buttonText,
  disabled,
  className,
}: HourMinuteInputProps) {
  const [internalValue, setInternalValue] = useState<Date>(value ?? new Date());

  const currentValue = value ?? internalValue;

  const updateValue = (nextValue: Date) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  };

  const { hour, minute, period } = useMemo(
    () => to12Hour(currentValue),
    [currentValue],
  );

  const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextHour = Number(event.target.value);
    if (Number.isNaN(nextHour)) return;
    updateValue(apply12Hour(currentValue, nextHour, minute, period));
  };

  const handleMinuteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextMinute = Number(event.target.value);
    if (Number.isNaN(nextMinute)) return;
    updateValue(apply12Hour(currentValue, hour, nextMinute, period));
  };

  const togglePeriod = () => {
    const nextPeriod = period === "AM" ? "PM" : "AM";
    updateValue(apply12Hour(currentValue, hour, minute, nextPeriod));
  };

  const handleAddMinutes = (minutesToAdd: number) => {
    const next = new Date(currentValue);
    next.setMinutes(next.getMinutes() + minutesToAdd);
    updateValue(next);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className} disabled={disabled}>
          {buttonText ?? formatTime(currentValue)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup className="space-y-3 p-2">
          <DropdownMenuLabel className="text-sm -mt-2 mb-1">
            Set time
          </DropdownMenuLabel>
          <div className="flex justify-between items-center gap-2 h-9">
            <Input
              type="number"
              min={1}
              max={12}
              value={hour}
              onChange={handleHourChange}
            />
            <span className="relative -top-0.5 font-bold">:</span>
            <Input
              type="number"
              min={0}
              max={59}
              value={minute}
              onChange={handleMinuteChange}
            />
            <Button
              type="button"
              variant={period === "AM" ? "outline" : "default"}
              size="sm"
              onClick={togglePeriod}
              className="h-full w-10"
            >
              {period}
            </Button>
          </div>
          <div className="flex justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddMinutes(30)}
            >
              +30 min
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddMinutes(60)}
            >
              +1 hr
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddMinutes(360)}
            >
              +6 hrs
            </Button>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
