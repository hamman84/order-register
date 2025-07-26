"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import FilterInput from "./filter-input";

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterOptions: { value: string; label: string }[];
  onOrderDeleted?: (orderId: string) => void;
  onOrderEdit?: (order: TData) => void;
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  filterOptions,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filterColumn, setFilterColumn] = useState(
    filterOptions[0]?.value || ""
  );
  const [filterValue, setFilterValue] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    table.getColumn(filterColumn)?.setFilterValue(value);
  };

  const handleColumnChange = (column: string) => {
    table.getColumn(filterColumn)?.setFilterValue("");
    setFilterColumn(column);
    setFilterValue("");

    if (filterValue) {
      table.getColumn(column)?.setFilterValue(filterValue);
    }
  };

  return (
    <>
      <div className="flex items-center py-4">
        <FilterInput
          options={filterOptions}
          value={filterValue}
          onChange={handleFilterChange}
          onColumnChange={handleColumnChange}
          selectedColumn={filterColumn}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
