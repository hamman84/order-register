"use client";

import type React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

import {
  getEventColorClasses,
  type SimpleCalendarEvent,
} from "@/components/simple-event-calendar";
import { cn } from "@/lib/utils";
import { BadgePlus } from "lucide-react";

interface WorkOrderItemProps {
  event: SimpleCalendarEvent;
  view: "month" | "week" | "day" | "agenda";
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export function WorkOrderItem({
  event,
  view,
  onClick,
  className,
}: WorkOrderItemProps) {
  const workOrder = event.workOrder;

  if (view === "agenda") {
    return (
      <button
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-col gap-2 rounded p-3 text-left transition outline-none focus-visible:ring-[3px] border",
          getEventColorClasses(event.color),
          className
        )}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{event.title}</div>
        </div>

        <div className="text-xs opacity-70">
          {format(event.date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
        </div>

        <div className="flex flex-wrap gap-1 text-xs">
          <span className="font-medium">Máquina:</span>
          <span>{workOrder?.machine}</span>
          {workOrder?.moreMachines && workOrder.moreMachines.length > 0 && (
            <span className="opacity-70">
              / {workOrder.moreMachines.join(" / ")}
            </span>
          )}
        </div>

        {workOrder?.dieCutter && (
          <div className="flex gap-1 text-xs">
            <span className="font-medium">Troquel:</span>
            <span>{workOrder.dieCutter}</span>
            {workOrder.newDieCutter && (
              <Badge variant="outline" className="text-[10px] h-4">
                Nuevo
              </Badge>
            )}
          </div>
        )}

        {workOrder?.stamping && (
          <div className="flex gap-1 text-xs">
            <span className="font-medium">Estampación:</span>
            <span>{workOrder.stamping}</span>
            {workOrder.newStamping && (
              <Badge variant="outline" className="text-[10px] h-4">
                Nueva
              </Badge>
            )}
          </div>
        )}

        {workOrder?.notes && (
          <div className="text-xs opacity-90 border-t pt-2 mt-1">
            <span className="font-medium">Notas:</span> {workOrder.notes}
          </div>
        )}
      </button>
    );
  }

  // Vista compacta para month, week, day
  return (
    <button
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 flex size-full overflow-hidden px-1 text-left font-medium backdrop-blur-md transition outline-none select-none focus-visible:ring-[3px] rounded relative",
        getEventColorClasses(event.color),
        view === "month" || view === "week"
          ? "mt-1 h-6 items-center text-[10px] sm:text-xs"
          : "py-1 text-xs items-center gap-1",
        className
      )}
      onClick={onClick}
    >
      {view === "month" || view === "week" ? (
        // Vista de mes y semana: solo título (espacio limitado)
        <div className="truncate font-medium">{event.title}</div>
      ) : (
        // Vista de día: información completa en una línea (más espacio horizontal)
        <div className="flex items-center gap-1 w-full min-w-0">
          <span className="font-medium text-[11px] shrink-0">
            {event.title}
          </span>
          <span className="text-[10px] opacity-60 shrink-0">•</span>
          <span className="text-[10px] opacity-75 shrink-0">
            {workOrder?.machine}
          </span>
          {workOrder?.moreMachines && workOrder.moreMachines.length > 0 && (
            <>
              <span className="text-[10px] opacity-60 shrink-0">/</span>
              <span className="text-[10px] opacity-75 truncate max-w-[80px]">
                {workOrder.moreMachines[0]}
              </span>
            </>
          )}
          {workOrder?.dieCutter && (
            <>
              <span className="text-[10px] opacity-60 shrink-0"> • </span>
              <span className="text-[10px] opacity-75 shrink-0">Troquel: </span>
              <span className="text-[10px] opacity-75 truncate max-w-[100px]">
                {workOrder.dieCutter}
              </span>
              {workOrder.newDieCutter && (
                <Badge variant="outline" className="text-[10px] h-4">
                  Nuevo
                </Badge>
              )}
            </>
          )}
          {workOrder?.stamping && (
            <>
              <span className="text-[10px] opacity-60 shrink-0"> • </span>
              <span className="text-[10px] opacity-75 shrink-0">
                Estampación:
              </span>
              <span className="text-[10px] opacity-75 truncate max-w-[100px]">
                {workOrder.stamping}
              </span>
              {workOrder.newStamping && (
                <Badge variant="outline" className="text-[10px] h-4">
                  Nueva
                </Badge>
              )}
            </>
          )}
        </div>
      )}
    </button>
  );
}
