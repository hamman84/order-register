"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
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
export const columns: ColumnDef<order>[] = [
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
      return <DeleteOrderDialog orderId={row.original.id} />;
    },
  },
];
