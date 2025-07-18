"use server";

import { Machine, Prisma } from "../generated/prisma";
import prisma from "../prisma";

export async function registerOrder({
  userId,
  code,
  machine,
  notes,
  dieCutter,
  stamping,
}: {
  userId: string;
  code: string;
  machine: Machine;
  notes?: string;
  dieCutter?: string;
  stamping?: string;
}) {
  try {
    const data = await prisma.order.create({
      data: {
        userId,
        code,
        machine,
        notes,
        dieCutter,
        stamping,
      },
    });

    return data;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.error("El parte ya existe:", error);
      }
    }
    console.error("Error creating order:", error);
    throw error;
  }
}
