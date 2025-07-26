"use client";

import type React from "react";
import { format, isToday } from "date-fns";
import { es } from "date-fns/locale";

import {
  EventItem,
  WorkOrderItem,
  getEventsForDay,
  type SimpleCalendarEvent,
} from "@/components/simple-event-calendar";

interface DayViewProps {
  currentDate: Date;
  events: SimpleCalendarEvent[];
  onEventSelect: (event: SimpleCalendarEvent) => void;
  onEventCreate: () => void;
  useWorkOrderItem?: boolean;
}

export function DayView({
  currentDate,
  events,
  onEventSelect,
  onEventCreate,
  useWorkOrderItem = false,
}: DayViewProps) {
  const dayEvents = getEventsForDay(events, currentDate);

  const handleEventClick = (
    event: SimpleCalendarEvent,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="bg-background/80 border-border/70 sticky top-0 z-30 border-b backdrop-blur-md">
        <div
          className="data-today:text-foreground text-muted-foreground/70 py-4 text-center text-lg data-today:font-medium"
          data-today={isToday(currentDate) || undefined}
        >
          {format(currentDate, "d 'de' MMM, EEEE", { locale: es })}
        </div>
      </div>

      <div
        className="flex-1 p-4 cursor-pointer min-h-96"
        onClick={onEventCreate}
      >
        <div className="space-y-3">
          {dayEvents.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">
              No hay partes de trabajo para este día. Haz clic para agregar uno.
            </div>
          ) : (
            dayEvents.map((event) =>
              useWorkOrderItem ? (
                <WorkOrderItem
                  key={event.id}
                  event={event}
                  view="day"
                  onClick={(e) => handleEventClick(event, e)}
                />
              ) : (
                <EventItem
                  key={event.id}
                  event={event}
                  view="day"
                  onClick={(e) => handleEventClick(event, e)}
                />
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}
