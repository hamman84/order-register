import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import WorkOrderCalendarClient from "./work-order-calendar-client";

export default async function CalendarPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session?.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Mapear los datos de Prisma al tipo Order (convertir null a undefined)
  const mappedOrders = orders.map(order => ({
    ...order,
    notes: order.notes || undefined,
    dieCutter: order.dieCutter || undefined,
    stamping: order.stamping || undefined,
  }));

  return (
    <WorkOrderCalendarClient
      userId={session?.user.id}
      initialOrders={mappedOrders}
    />
  );
}
