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
  MonthView,
  type CalendarWorkOrder,
  type EventColor,
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
import RegisterOrder from "@/app/dashboard/register-order";

export interface WorkOrderCalendarProps {
  orders?: CalendarWorkOrder[];
  onOrderAdd?: (order: CalendarWorkOrder) => void;
  onOrderUpdate?: (order: CalendarWorkOrder) => void;
  onOrderDelete?: (orderId: string) => void;
  className?: string;
  initialView?: CalendarView;
  userId: string;
}

export function WorkOrderCalendar({
  orders = [],
  onOrderAdd,
  onOrderUpdate,
  className,
  initialView = "month",
  userId,
}: WorkOrderCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(initialView);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CalendarWorkOrder | null>(
    null
  );

  // Agregar atajos de teclado para cambiar vistas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Saltar si el usuario está escribiendo en un input, textarea o elemento contentEditable
      // o si el diálogo de orden está abierto
      if (
        isOrderDialogOpen ||
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
  }, [isOrderDialogOpen]);

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

  const handleOrderSelect = (order: CalendarWorkOrder) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true);
  };

  const handleOrderCreate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newOrder: CalendarWorkOrder = {
      id: "",
      code: "",
      machine: "",
      notes: "",
      date: today,
    };
    setSelectedOrder(newOrder);
    setIsOrderDialogOpen(true);
  };

  const handleOrderSave = (orderData: Partial<CalendarWorkOrder>) => {
    const order: CalendarWorkOrder = {
      ...orderData,
      id: orderData.id || "",
      code: orderData.code || "",
      machine: orderData.machine || "",
      date: selectedOrder?.date || new Date(),
    } as CalendarWorkOrder;

    if (order.id) {
      onOrderUpdate?.(order);
      toast(`Orden "${order.code}" actualizada`, {
        description: format(order.date, "d 'de' MMMM 'de' yyyy", {
          locale: es,
        }),
        position: "bottom-left",
      });
    } else {
      onOrderAdd?.({
        ...order,
        id: Math.random().toString(36).substring(2, 11),
      });
      toast(`Orden "${order.code}" agregada`, {
        description: format(order.date, "d 'de' MMMM 'de' yyyy", {
          locale: es,
        }),
        position: "bottom-left",
      });
    }
    setIsOrderDialogOpen(false);
    setSelectedOrder(null);
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

  // Convertir órdenes a eventos para compatibilidad con las vistas existentes
  const events = useMemo(() => {
    return orders.map((order) => ({
      id: order.id,
      title: order.code,
      description: `${order.machine}${
        order.moreMachines?.length ? ` / ${order.moreMachines.join(" / ")}` : ""
      }${order.notes ? ` - ${order.notes}` : ""}`,
      date: order.date,
      color: "orange" as EventColor, // Color fijo simple
      workOrder: order,
    }));
  }, [orders]);

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
            onClick={handleOrderCreate}
          >
            <PlusIcon
              className="opacity-60 sm:-ms-1"
              size={16}
              aria-hidden="true"
            />
            <span className="max-sm:sr-only">Nueva orden</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {view === "month" && (
          <MonthView
            currentDate={currentDate}
            events={events}
            onEventSelect={(event) =>
              event.workOrder && handleOrderSelect(event.workOrder)
            }
            onEventCreate={handleOrderCreate}
            useWorkOrderItem={true}
          />
        )}
        {view === "week" && (
          <WeekView
            currentDate={currentDate}
            events={events}
            onEventSelect={(event) =>
              event.workOrder && handleOrderSelect(event.workOrder)
            }
            onEventCreate={handleOrderCreate}
            useWorkOrderItem={true}
          />
        )}
        {view === "day" && (
          <DayView
            currentDate={currentDate}
            events={events}
            onEventSelect={(event) =>
              event.workOrder && handleOrderSelect(event.workOrder)
            }
            onEventCreate={handleOrderCreate}
            useWorkOrderItem={true}
          />
        )}
        {view === "agenda" && (
          <AgendaView
            currentDate={currentDate}
            events={events}
            onEventSelect={(event) =>
              event.workOrder && handleOrderSelect(event.workOrder)
            }
            onEventCreate={handleOrderCreate}
            useWorkOrderItem={true}
          />
        )}
      </div>

      {selectedOrder && (
        <RegisterOrder
          userId={userId}
          mode={selectedOrder.id ? "edit" : "create"}
          existingOrder={
            selectedOrder.id
              ? {
                  ...selectedOrder,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }
              : undefined
          }
          onOrderCreated={handleOrderSave}
          onOrderUpdated={handleOrderSave}
          isOpen={isOrderDialogOpen}
          onOpenChange={(open) => {
            setIsOrderDialogOpen(open);
            if (!open) {
              setSelectedOrder(null);
            }
          }}
        />
      )}
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
