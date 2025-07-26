"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarCheck,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  AgendaView,
  type CalendarView,
  DayView,
  EventDialog,
  MonthView,
  type SimpleCalendarEvent,
  WeekView,
} from "@/components/simple-event-calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface SimpleEventCalendarProps {
  events?: SimpleCalendarEvent[];
  onEventAdd?: (event: SimpleCalendarEvent) => void;
  onEventUpdate?: (event: SimpleCalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  className?: string;
  initialView?: CalendarView;
}

export function SimpleEventCalendar({
  events = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  className,
  initialView = "month",
}: SimpleEventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(initialView);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] =
    useState<SimpleCalendarEvent | null>(null);

  // Add keyboard shortcuts for view switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea or contentEditable element
      // or if the event dialog is open
      if (
        isEventDialogOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "m":
          setView("month");
          break;
        case "s":
          setView("week");
          break;
        case "d":
          setView("day");
          break;
        case "a":
          setView("agenda");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEventDialogOpen]);

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, -1));
    } else if (view === "agenda") {
      setCurrentDate(addDays(currentDate, -30));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === "agenda") {
      setCurrentDate(addDays(currentDate, 30));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventSelect = (event: SimpleCalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleEventCreate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newEvent: SimpleCalendarEvent = {
      id: "",
      title: "",
      description: "",
      date: today,
    };
    setSelectedEvent(newEvent);
    setIsEventDialogOpen(true);
  };

  const handleEventSave = (event: SimpleCalendarEvent) => {
    if (event.id) {
      onEventUpdate?.(event);
      toast(`Evento "${event.title}" actualizado`, {
        description: format(event.date, "d 'de' MMMM 'de' yyyy", {
          locale: es,
        }),
        position: "bottom-left",
      });
    } else {
      onEventAdd?.({
        ...event,
        id: Math.random().toString(36).substring(2, 11),
      });
      toast(`Evento "${event.title}" agregado`, {
        description: format(event.date, "d 'de' MMMM 'de' yyyy", {
          locale: es,
        }),
        position: "bottom-left",
      });
    }
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleEventDelete = (eventId: string) => {
    const deletedEvent = events.find((e) => e.id === eventId);
    onEventDelete?.(eventId);
    setIsEventDialogOpen(false);
    setSelectedEvent(null);

    if (deletedEvent) {
      toast(`Evento "${deletedEvent.title}" eliminado`, {
        description: format(deletedEvent.date, "d 'de' MMMM 'de' yyyy", {
          locale: es,
        }),
        position: "bottom-left",
      });
    }
  };

  const viewTitle = useMemo(() => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy", { locale: es });
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy", { locale: es });
      } else {
        return `${format(start, "MMM", { locale: es })} - ${format(
          end,
          "MMM yyyy",
          { locale: es }
        )}`;
      }
    } else if (view === "day") {
      return (
        <>
          <span className="min-[480px]:hidden" aria-hidden="true">
            {format(currentDate, "d MMM yyyy", { locale: es })}
          </span>
          <span className="max-[479px]:hidden min-md:hidden" aria-hidden="true">
            {format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
          </span>
          <span className="max-md:hidden">
            {format(currentDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
          </span>
        </>
      );
    } else if (view === "agenda") {
      const start = currentDate;
      const end = addDays(currentDate, 29);

      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy", { locale: es });
      } else {
        return `${format(start, "MMM", { locale: es })} - ${format(
          end,
          "MMM yyyy",
          { locale: es }
        )}`;
      }
    } else {
      return format(currentDate, "MMMM yyyy", { locale: es });
    }
  }, [currentDate, view]);

  return (
    <div className="flex flex-col rounded-lg border">
      <div
        className={cn(
          "flex items-center justify-between p-2 sm:p-4",
          className
        )}
      >
        <div className="flex items-center gap-1 sm:gap-4">
          <Button
            variant="outline"
            className="max-[479px]:aspect-square max-[479px]:p-0! bg-transparent"
            onClick={handleToday}
          >
            <CalendarCheck
              className="min-[480px]:hidden"
              size={16}
              aria-hidden="true"
            />
            <span className="max-[479px]:sr-only">Hoy</span>
          </Button>
          <div className="flex items-center sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              aria-label="Anterior"
            >
              <ChevronLeftIcon size={16} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              aria-label="Siguiente"
            >
              <ChevronRightIcon size={16} aria-hidden="true" />
            </Button>
          </div>
          <h2 className="text-sm font-semibold sm:text-lg md:text-xl">
            {viewTitle}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-1.5 max-[479px]:h-8 bg-transparent"
              >
                <span>
                  <span className="min-[480px]:hidden" aria-hidden="true">
                    {getViewShortName(view)}
                  </span>
                  <span className="max-[479px]:sr-only">
                    {getViewName(view)}
                  </span>
                </span>
                <ChevronDownIcon
                  className="-me-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              <DropdownMenuItem onClick={() => setView("month")}>
                Mes <DropdownMenuShortcut>M</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView("week")}>
                Semana <DropdownMenuShortcut>S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView("day")}>
                Día <DropdownMenuShortcut>D</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView("agenda")}>
                Agenda <DropdownMenuShortcut>A</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className="max-[479px]:aspect-square max-[479px]:p-0!"
            size="sm"
            onClick={handleEventCreate}
          >
            <PlusIcon
              className="opacity-60 sm:-ms-1"
              size={16}
              aria-hidden="true"
            />
            <span className="max-sm:sr-only">Nuevo evento</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {view === "month" && (
          <MonthView
            currentDate={currentDate}
            events={events}
            onEventSelect={handleEventSelect}
            onEventCreate={handleEventCreate}
          />
        )}
        {view === "week" && (
          <WeekView
            currentDate={currentDate}
            events={events}
            onEventSelect={handleEventSelect}
            onEventCreate={handleEventCreate}
          />
        )}
        {view === "day" && (
          <DayView
            currentDate={currentDate}
            events={events}
            onEventSelect={handleEventSelect}
            onEventCreate={handleEventCreate}
          />
        )}
        {view === "agenda" && (
          <AgendaView
            currentDate={currentDate}
            events={events}
            onEventCreate={handleEventCreate}
            onEventSelect={handleEventSelect}
          />
        )}
      </div>

      <EventDialog
        event={selectedEvent}
        isOpen={isEventDialogOpen}
        onClose={() => {
          setIsEventDialogOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
      />
    </div>
  );
}

// Funciones auxiliares
function getViewName(view: CalendarView): string {
  const names = {
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
  };
  return names[view];
}

function getViewShortName(view: CalendarView): string {
  const names = {
    month: "M",
    week: "S",
    day: "D",
    agenda: "A",
  };
  return names[view];
}
