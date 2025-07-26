"use client";

import type React from "react";
import { addDays, format, isToday, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

import {
  EventItem,
  WorkOrderItem,
  getEventsForDay,
  type SimpleCalendarEvent,
} from "@/components/simple-event-calendar";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  currentDate: Date;
  events: SimpleCalendarEvent[];
  onEventSelect: (event: SimpleCalendarEvent) => void;
  onEventCreate: (date?: Date) => void;
  useWorkOrderItem?: boolean;
}

export function WeekView({
  currentDate,
  events,
  onEventSelect,
  onEventCreate,
  useWorkOrderItem = false,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleEventClick = (
    event: SimpleCalendarEvent,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  const handleDayClick = (date: Date) => {
    onEventCreate(date);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="bg-background/80 border-border/70 sticky top-0 z-30 grid grid-cols-7 border-b backdrop-blur-md">
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className={cn(
              "border-border/70 text-muted-foreground/70 py-2 text-center text-sm border-r last:border-r-0",
              isToday(day) && "text-foreground font-medium"
            )}
          >
            <div>{format(day, "EEE", { locale: es })}</div>
            <div className="text-lg">{format(day, "d")}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7">
        {weekDays.map((day) => {
          const dayEvents = getEventsForDay(events, day);
          return (
            <div
              key={day.toString()}
              className="border-border/70 flex flex-col border-r p-2 last:border-r-0 cursor-pointer min-h-96"
              onClick={() => handleDayClick(day)}
            >
              <div className="space-y-1">
                {dayEvents.map((event) =>
                  useWorkOrderItem ? (
                    <WorkOrderItem
                      key={event.id}
                      event={event}
                      view="week"
                      onClick={(e) => handleEventClick(event, e)}
                    />
                  ) : (
                    <EventItem
                      key={event.id}
                      event={event}
                      view="week"
                      onClick={(e) => handleEventClick(event, e)}
                    />
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
