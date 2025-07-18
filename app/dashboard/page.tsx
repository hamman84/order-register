import { order } from "@/components/order-table/columns";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const initialOrders = await prisma.order.findMany({
    where: {
      userId: session?.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!session) {
    return redirect("/");
  }

  return (
    <DashboardClient
      userId={session?.user.id}
      initialOrders={initialOrders as order[]}
    />
  );
}
