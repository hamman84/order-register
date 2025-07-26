"use client";

import type React from "react";

import { format } from "date-fns";

import {
  getEventColorClasses,
  type SimpleCalendarEvent,
} from "@/components/simple-event-calendar";
import { cn } from "@/lib/utils";

interface EventItemProps {
  event: SimpleCalendarEvent;
  view: "month" | "week" | "day" | "agenda";
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export function EventItem({ event, view, onClick, className }: EventItemProps) {
  if (view === "agenda") {
    return (
      <button
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-col gap-1 rounded p-2 text-left transition outline-none focus-visible:ring-[3px]",
          getEventColorClasses(event.color),
          className
        )}
        onClick={onClick}
      >
        <div className="text-sm font-medium">{event.title}</div>
        <div className="text-xs opacity-70">
          {format(event.date, "EEEE, MMMM d, yyyy")}
        </div>
        {event.description && (
          <div className="my-1 text-xs opacity-90">{event.description}</div>
        )}
      </button>
    );
  }

  return (
    <button
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 flex size-full overflow-hidden px-1 text-left font-medium backdrop-blur-md transition outline-none select-none focus-visible:ring-[3px] rounded",
        getEventColorClasses(event.color),
        view === "month"
          ? "mt-1 h-6 items-center text-[10px] sm:text-xs"
          : "py-1 text-xs",
        className
      )}
      onClick={onClick}
    >
      <span className="truncate">{event.title}</span>
    </button>
  );
}
