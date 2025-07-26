"use client";

import { createColumns, order } from "@/components/order-table/columns";
import { DataTable } from "@/components/order-table/data-table";
import { useState } from "react";
import RegisterOrder from "./register-order";

interface DashboardClientProps {
  userId: string;
  initialOrders: order[];
}

export default function DashboardClient({
  userId,
  initialOrders,
}: DashboardClientProps) {
  const [orders, setOrders] = useState<order[]>(initialOrders);
  const [editingOrder, setEditingOrder] = useState<order | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleOrderCreated = (newOrder: order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleOrderDeleted = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  const handleOrderEdit = (order: order) => {
    setEditingOrder(order);
    setIsEditDialogOpen(true);
  };

  const handleOrderUpdated = (updatedOrder: order) => {
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
