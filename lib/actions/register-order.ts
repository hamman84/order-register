"use server";

import { Machine, Prisma } from "../generated/prisma";
import prisma from "../prisma";

export async function registerOrder({
  userId,
  code,
  machine,
  moreMachines,
  notes,
  dieCutter,
  newDieCutter,
  stamping,
  newStamping,
}: {
  userId: string;
  code: string;
  machine: Machine;
  moreMachines?: Machine[];
  notes?: string;
  dieCutter?: string;
  stamping?: string;
  newDieCutter?: boolean;
  newStamping?: boolean;
}) {
  try {
    const data = await prisma.order.create({
      data: {
        userId,
        code,
        machine,
        moreMachines: moreMachines || [],
        notes,
        dieCutter,
        newDieCutter: newDieCutter || false,
        stamping,
        newStamping: newStamping || false,
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
