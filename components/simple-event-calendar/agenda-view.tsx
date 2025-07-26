"use client";

import type React from "react";

import { useMemo } from "react";

import { addDays, format, isToday } from "date-fns";
import { es } from "date-fns/locale";

import {
  EventItem,
  WorkOrderItem,
  getEventsForDay,
  type SimpleCalendarEvent,
} from "@/components/simple-event-calendar";
import { CalendarRange } from "lucide-react";

interface AgendaViewProps {
  currentDate: Date;
  events: SimpleCalendarEvent[];
  onEventSelect: (event: SimpleCalendarEvent) => void;
  onEventCreate: () => void;
  useWorkOrderItem?: boolean;
}

export function AgendaView({
  currentDate,
  events,
  onEventSelect,
  onEventCreate,
  useWorkOrderItem = false,
}: AgendaViewProps) {
  const days = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) =>
      addDays(new Date(currentDate), i)
    );
  }, [currentDate]);

  const handleEventClick = (
    event: SimpleCalendarEvent,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  const hasEvents = days.some((day) => getEventsForDay(events, day).length > 0);

  return (
    <div className="border-border/70 border-t px-4">
      {!hasEvents ? (
        <div className="flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
          <CalendarRange size={32} className="text-muted-foreground/50 mb-2" />
          <h3 className="text-lg font-medium">No hay eventos</h3>
          <p className="text-muted-foreground">
            No hay eventos programados para este período de tiempo.
          </p>
          <button
            onClick={onEventCreate}
            className="text-primary hover:underline mt-2"
          >
            Agregar un nuevo parte de trabajo
          </button>
        </div>
      ) : (
        days.map((day) => {
          const dayEvents = getEventsForDay(events, day);

          if (dayEvents.length === 0) return null;

          return (
            <div
              key={day.toString()}
              className="border-border/70 relative my-12 border-t"
            >
              <span
                className="bg-background absolute -top-3 left-0 flex h-6 items-center pe-4 text-[10px] uppercase data-today:font-medium sm:pe-4 sm:text-xs"
                data-today={isToday(day) || undefined}
              >
                {format(day, "d 'de' MMM, EEEE", { locale: es })}
              </span>
              <div className="mt-6 space-y-2">
                {dayEvents.map((event) => {
                  const ItemComponent = useWorkOrderItem
                    ? WorkOrderItem
                    : EventItem;
                  return (
                    <ItemComponent
                      key={event.id}
                      event={event}
                      view="agenda"
                      onClick={(e) => handleEventClick(event, e)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
