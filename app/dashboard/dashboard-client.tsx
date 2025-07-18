"use client";

import { columns, order } from "@/components/order-table/columns";
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

  const handleOrderCreated = (newOrder: order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleOrderDeleted = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  const filterOptions = [
    { value: "code", label: "Nº de parte" },
    { value: "dieCutter", label: "Troquel" },
    { value: "stamping", label: "Estampación" },
    { value: "machine", label: "Máquina" },
  ];

  return (
    <>
      <RegisterOrder userId={userId} onOrderCreated={handleOrderCreated} />
      <DataTable
        columns={columns}
        data={orders}
        filterOptions={filterOptions}
        onOrderDeleted={handleOrderDeleted}
      />
    </>
  );
}
