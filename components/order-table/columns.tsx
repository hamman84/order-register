"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import DeleteOrderDialog from "../delete-order-dialog";

export type order = {
  id: string;
  code: string;
  machine:
    | "Wanjie"
    | "Viva1"
    | "Berra1"
    | "Berra2"
    | "P5"
    | "E5"
    | "Wei"
    | "Mida"
    | "HP";
  notes: string;
  dieCutter: string;
  stamping: string;
  createdAt: Date;
};

// Crear columnas como función para poder pasar callbacks
export const createColumns = (
  onEdit?: (order: order) => void,
  onDelete?: (orderId: string) => void
): ColumnDef<order>[] => [
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
  },
  {
    accessorKey: "createdAt",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
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
