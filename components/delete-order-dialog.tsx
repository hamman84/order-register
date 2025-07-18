"use client";

import { CircleAlertIcon, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteOrder } from "@/lib/actions/delete-order";

interface DeleteOrderDialogProps {
  orderId: string;
  onOrderDeleted?: (orderId: string) => void;
}

export default function DeleteOrderDialog({
  orderId,
  onOrderDeleted,
}: DeleteOrderDialogProps) {
  const handleDelete = async () => {
    try {
      await deleteOrder(orderId);
      if (onOrderDeleted) {
        onOrderDeleted(orderId);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="group cursor-pointer hover:bg-red-500"
        >
          <Trash2
            size={16}
            className="text-red-600 group-hover:text-red-50"
            aria-hidden="true"
          />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar registro</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar este registro? Esta acción no
              se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
