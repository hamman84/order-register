"use client";

import { createColumns } from "@/components/order-table/columns";
import { DataTable } from "@/components/order-table/data-table";
import { useState } from "react";
import RegisterOrder, { Order } from "./register-order";

interface DashboardClientProps {
  userId: string;
  initialOrders: Order[];
}

export default function DashboardClient({
  userId,
  initialOrders,
}: DashboardClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleOrderDeleted = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  const handleOrderEdit = (order: Order) => {
    setEditingOrder(order);
    setIsEditDialogOpen(true);
  };

  const handleOrderUpdated = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );
    setEditingOrder(null);
  };

  const filterOptions = [
    { value: "code", label: "Nº de parte" },
    { value: "dieCutter", label: "Troquel" },
    { value: "stamping", label: "Estampación" },
    { value: "machine", label: "Máquina" },
  ];

  // Crear columnas con callbacks
  const columns = createColumns(handleOrderEdit, handleOrderDeleted);

  return (
    <>
      <RegisterOrder userId={userId} onOrderCreated={handleOrderCreated} />

      {/* Diálogo de edición */}
      {editingOrder && (
        <RegisterOrder
          userId={userId}
          mode="edit"
          existingOrder={editingOrder}
          onOrderUpdated={handleOrderUpdated}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}

      <DataTable
        columns={columns}
        data={orders}
        filterOptions={filterOptions}
        onOrderDeleted={handleOrderDeleted}
        onOrderEdit={handleOrderEdit}
      />
    </>
  );
}
