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

interface DataTableProps<
  TData extends { id: string; createdAt: Date | string },
  TValue
> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterOptions: { value: string; label: string }[];
  onOrderDeleted?: (orderId: string) => void;
  onOrderEdit?: (order: TData) => void;
}

export function DataTable<
  TData extends { id: string; createdAt: Date | string },
  TValue
>({ columns, data, filterOptions }: DataTableProps<TData, TValue>) {
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

  // Agrupar datos filtrados por día
  const groupedByDay = useMemo(() => {
    const filteredRows = table.getFilteredRowModel().rows;
    const groups = new Map<string, typeof filteredRows>();

    filteredRows.forEach((row) => {
      const date = new Date(row.original.createdAt);
      const dayKey = date.toISOString().split("T")[0]; // YYYY-MM-DD format

      if (!groups.has(dayKey)) {
        groups.set(dayKey, []);
      }
      groups.get(dayKey)!.push(row);
    });

    // Convertir a array y ordenar por fecha (más reciente primero)
    return Array.from(groups.entries())
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([date, rows]) => ({
        date,
        rows: rows.sort((a, b) => {
          const dateA = new Date(a.original.createdAt).getTime();
          const dateB = new Date(b.original.createdAt).getTime();
          return dateB - dateA; // Más reciente primero dentro del día
        }),
      }));
  }, [table.getFilteredRowModel().rows]);

  // Obtener los datos del día actual
  const currentDayData = groupedByDay[currentDayIndex];
  const totalDays = groupedByDay.length;

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    table.getColumn(filterColumn)?.setFilterValue(value);
    setCurrentDayIndex(0); // Reset to first day when filtering
  };

  const handleColumnChange = (column: string) => {
    table.getColumn(filterColumn)?.setFilterValue("");
    setFilterColumn(column);
    setFilterValue("");

    if (filterValue) {
      table.getColumn(column)?.setFilterValue(filterValue);
    }
  };

  const goToPreviousDay = () => {
    setCurrentDayIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNextDay = () => {
    setCurrentDayIndex((prev) => Math.min(totalDays - 1, prev + 1));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

      {/* Controles de paginación por día */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousDay}
            disabled={currentDayIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Día anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextDay}
            disabled={currentDayIndex === totalDays - 1}
          >
            Día siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {totalDays > 0 ? (
            <>
              <span>
                Día {currentDayIndex + 1} de {totalDays}
              </span>
              {currentDayData && (
                <span className="font-medium">
                  {formatDate(currentDayData.date)} (
                  {currentDayData.rows.length} registros)
                </span>
              )}
            </>
          ) : (
            <span>No hay datos</span>
          )}
        </div>
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
            {currentDayData?.rows?.length ? (
              currentDayData.rows.map((row) => (
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
                  {totalDays === 0
                    ? "No results."
                    : "No hay registros para este día."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
