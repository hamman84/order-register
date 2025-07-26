"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, BadgePlus, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import DeleteOrderDialog from "../delete-order-dialog";
import { Order } from "@/app/dashboard/register-order";

// Crear columnas como función para poder pasar callbacks
export const createColumns = (
  onEdit?: (order: Order) => void,
  onDelete?: (orderId: string) => void
): ColumnDef<Order>[] => [
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <strong>Código de Trabajo</strong>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "machine",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <strong>Máquina</strong>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const machine = row.original.machine;
      const moreMachines = row.original.moreMachines || [];
      return (
        <span className="capitalize">
          {machine}{" "}
          {moreMachines.length > 0 && <span>/ {moreMachines.join("/ ")}</span>}
        </span>
      );
    },
  },
  {
    accessorKey: "notes",
    header: () => {
      return <span className="font-bold">Notas</span>;
    },
  },
  {
    accessorKey: "dieCutter",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <strong>Nº de troquel</strong>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dieCutter = row.original.dieCutter;
      return dieCutter ? (
        <div className="flex items-center justify-center gap-2">
          <span className="capitalize">{dieCutter}</span>
          {row.original.newDieCutter && (
            <span className="text-green-500">
              <BadgePlus className="inline h-4 w-4" />
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span className="text-muted-foreground">N/A</span>
          {row.original.newDieCutter && (
            <span className="text-green-500">
              <BadgePlus className="inline h-4 w-4" />
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "stamping",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <strong>Nº de estampación</strong>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const stamping = row.original.stamping;
      return stamping ? (
        <div className="flex items-center justify-center gap-2">
          <span className="capitalize">{stamping}</span>
          {row.original.newStamping && (
            <span className="text-green-500">
              <BadgePlus className="inline h-4 w-4" />
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span className="text-muted-foreground">N/A</span>
          {row.original.newStamping && (
            <span className="text-green-500">
              <BadgePlus className="inline h-4 w-4" />
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <strong>Fecha de Creación</strong>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              className="cursor-pointer hover:text-emerald-700"
              variant="outline"
              size="sm"
              onClick={() => onEdit(row.original)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <DeleteOrderDialog
              orderId={row.original.id}
              onOrderDeleted={onDelete}
            />
          )}
        </div>
      );
    },
  },
];

// Mantener las columnas básicas para compatibilidad
export const columns = createColumns();
