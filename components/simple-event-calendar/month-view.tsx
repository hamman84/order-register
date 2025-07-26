"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import {
  EventItem,
  WorkOrderItem,
  getEventsForDay,
  type SimpleCalendarEvent,
  useEventVisibility,
  EventHeight,
  EventGap,
} from "@/components/simple-event-calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MonthViewProps {
  currentDate: Date;
  events: SimpleCalendarEvent[];
  onEventSelect: (event: SimpleCalendarEvent) => void;
  onEventCreate: () => void;
  useWorkOrderItem?: boolean;
}

export function MonthView({
  currentDate,
  events,
  onEventSelect,
  onEventCreate,
  useWorkOrderItem = false,
}: MonthViewProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Lunes
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 }); // Lunes

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const weekdays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i); // Lunes
      return format(date, "EEE");
    });
  }, []);

  const weeks = useMemo(() => {
    const result = [];
    let week = [];

    for (let i = 0; i < days.length; i++) {
      week.push(days[i]);
      if (week.length === 7 || i === days.length - 1) {
        result.push(week);
        week = [];
      }
    }

    return result;
  }, [days]);

  const handleEventClick = (
    event: SimpleCalendarEvent,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  const [isMounted, setIsMounted] = useState(false);
  const { contentRef, getVisibleEventCount } = useEventVisibility({
    eventHeight: EventHeight,
    eventGap: EventGap,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className="contents"
      style={
        {
          "--event-height": `${EventHeight}px`,
          "--event-gap": `${EventGap}px`,
        } as React.CSSProperties
      }
    >
      <div className="border-border/70 grid grid-cols-7 border-b">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-muted-foreground/70 py-2 text-center text-sm"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid flex-1 auto-rows-fr">
        {weeks.map((week, weekIndex) => (
          <div
            key={`week-${weekIndex}`}
            className="grid grid-cols-7 [&:last-child>*]:border-b-0"
          >
            {week.map((day, dayIndex) => {
              if (!day) return null;

              const dayEvents = getEventsForDay(events, day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isReferenceCell = weekIndex === 0 && dayIndex === 0;
              const visibleCount = isMounted
                ? getVisibleEventCount(dayEvents.length)
                : undefined;
              const hasMore =
                visibleCount !== undefined && dayEvents.length > visibleCount;
              const remainingCount = hasMore
                ? dayEvents.length - visibleCount
                : 0;

              return (
                <div
                  key={day.toString()}
                  className="group border-border/70 data-outside-cell:bg-muted/25 data-outside-cell:text-muted-foreground/70 border-r border-b last:border-r-0"
                  data-today={isToday(day) || undefined}
                  data-outside-cell={!isCurrentMonth || undefined}
                >
                  <div
                    className="flex h-full flex-col overflow-hidden px-0.5 py-1 sm:px-1 cursor-pointer"
                    onClick={onEventCreate}
                  >
                    <div className="group-data-today:bg-primary group-data-today:text-primary-foreground mt-1 inline-flex size-6 items-center justify-center rounded-full text-sm">
                      {format(day, "d")}
                    </div>
                    <div
                      ref={isReferenceCell ? contentRef : null}
                      className="min-h-[calc((var(--event-height)+var(--event-gap))*2)] sm:min-h-[calc((var(--event-height)+var(--event-gap))*3)] lg:min-h-[calc((var(--event-height)+var(--event-gap))*4)]"
                    >
                      {dayEvents.map((event, index) => {
                        const isHidden =
                          isMounted && visibleCount && index >= visibleCount;

                        if (!visibleCount) return null;

                        const ItemComponent = useWorkOrderItem
                          ? WorkOrderItem
                          : EventItem;

                        return (
                          <div
                            key={event.id}
                            className="aria-hidden:hidden"
                            aria-hidden={isHidden ? "true" : undefined}
                          >
                            <ItemComponent
                              event={event}
                              view="month"
                              onClick={(e) => handleEventClick(event, e)}
                            />
                          </div>
                        );
                      })}

                      {hasMore && (
                        <Popover modal>
                          <PopoverTrigger asChild>
                            <button
                              className="focus-visible:border-ring focus-visible:ring-ring/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 mt-[var(--event-gap)] flex h-[var(--event-height)] w-full items-center overflow-hidden px-1 text-left text-[10px] backdrop-blur-md transition outline-none select-none focus-visible:ring-[3px] sm:px-2 sm:text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>
                                + {remainingCount}{" "}
                                <span className="max-sm:sr-only">más</span>
                              </span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="center"
                            className="max-w-52 p-3"
                            style={
                              {
                                "--event-height": `${EventHeight}px`,
                              } as React.CSSProperties
                            }
                          >
                            <div className="space-y-2">
                              <div className="text-sm font-medium">
                                {format(day, "EEE d")}
                              </div>
                              <div className="space-y-1">
                                {dayEvents.map((event) => {
                                  const ItemComponent = useWorkOrderItem
                                    ? WorkOrderItem
                                    : EventItem;
                                  return (
                                    <ItemComponent
                                      key={event.id}
                                      event={event}
                                      view="month"
                                      onClick={(e) =>
                                        handleEventClick(event, e)
                                      }
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
