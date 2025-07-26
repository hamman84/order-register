"use client";

import { useState } from "react";
import {
  WorkOrderCalendar,
  type CalendarWorkOrder,
} from "@/components/simple-event-calendar";
import { registerOrder } from "@/lib/actions/register-order";
import { updateOrder } from "@/lib/actions/update-order";
import { deleteOrder } from "@/lib/actions/delete-order";
import { toast } from "sonner";
import { Order } from "../register-order";
import { Machine } from "@/lib/generated/prisma";

interface WorkOrderCalendarClientProps {
  userId: string;
  initialOrders: Order[];
}

export default function WorkOrderCalendarClient({
  userId,
  initialOrders,
}: WorkOrderCalendarClientProps) {
  // Convertir órdenes a formato de calendario
  const [orders, setOrders] = useState<CalendarWorkOrder[]>(
    initialOrders.map((order) => ({
      id: order.id,
      code: order.code,
      machine: order.machine,
      moreMachines: order.moreMachines,
      notes: order.notes || undefined,
      dieCutter: order.dieCutter || undefined,
      newDieCutter: order.newDieCutter,
      stamping: order.stamping || undefined,
      newStamping: order.newStamping,
      date: order.createdAt, // Usar fecha de creación
    }))
  );

  const handleOrderAdd = async (newOrder: CalendarWorkOrder) => {
    try {
      const createdOrder = await registerOrder({
        userId,
        code: newOrder.code,
        machine: newOrder.machine as Machine,
        moreMachines: newOrder.moreMachines as Machine[],
        notes: newOrder.notes,
        dieCutter: newOrder.dieCutter,
        newDieCutter: newOrder.newDieCutter,
        stamping: newOrder.stamping,
        newStamping: newOrder.newStamping,
      });

      if (createdOrder) {
        const calendarOrder: CalendarWorkOrder = {
          id: createdOrder.id,
          code: createdOrder.code,
          machine: createdOrder.machine,
          moreMachines: createdOrder.moreMachines,
          notes: createdOrder.notes || undefined,
          dieCutter: createdOrder.dieCutter || undefined,
          newDieCutter: createdOrder.newDieCutter,
          stamping: createdOrder.stamping || undefined,
          newStamping: createdOrder.newStamping,
          date: newOrder.date,
        };

        setOrders((prev) => [calendarOrder, ...prev]);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Error al crear la orden");
    }
  };

  const handleOrderUpdate = async (updatedOrder: CalendarWorkOrder) => {
    try {
      const updated = await updateOrder({
        id: updatedOrder.id,
        userId,
        code: updatedOrder.code,
        machine: updatedOrder.machine as Machine,
        moreMachines: updatedOrder.moreMachines as Machine[],
        notes: updatedOrder.notes,
        dieCutter: updatedOrder.dieCutter,
        newDieCutter: updatedOrder.newDieCutter,
        stamping: updatedOrder.stamping,
        newStamping: updatedOrder.newStamping,
      });

      if (updated) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Error al actualizar la orden");
    }
  };

  const handleOrderDelete = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error al eliminar la orden");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Calendario de Órdenes de Trabajo
        </h1>
        <p className="text-muted-foreground">
          Visualiza y gestiona tus órdenes de trabajo en un calendario
          interactivo.
        </p>
      </div>

      <WorkOrderCalendar
        orders={orders}
        onOrderAdd={handleOrderAdd}
        onOrderUpdate={handleOrderUpdate}
        onOrderDelete={handleOrderDelete}
        userId={userId}
        initialView="month"
        className="w-full"
      />
    </div>
  );
}
