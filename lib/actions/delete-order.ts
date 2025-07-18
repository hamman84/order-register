"use server";

import prisma from "../prisma";

export async function deleteOrder(orderId: string) {
  try {
    const deletedOrder = await prisma.order.delete({
      where: { id: orderId },
    });
    return deletedOrder;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}
