"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { CircleCheckBig, RefreshCcwIcon, Edit } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { $Enums } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { registerOrder } from "@/lib/actions/register-order";
import { updateOrder } from "@/lib/actions/update-order";
import { useState, useEffect } from "react";

const Machine = $Enums.Machine;

const registerOrderSchema = z.object({
  code: z.string().min(1, "El código es obligatorio"),
  machine: z.enum(Machine, { error: "Selecciona una máquina verificada" }),
  notes: z.string().optional(),
  dieCutter: z.string().optional(),
  stamping: z.string().optional(),
});

// Tipo para la orden existente
export interface Order {
  id: string;
  code: string;
  machine: string;
  notes?: string;
  dieCutter?: string;
  stamping?: string;
}

interface RegisterOrderProps {
  userId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOrderCreated?: (order: any) => void;
  // Nuevas props para el modo edición
  mode?: "create" | "edit";
  existingOrder?: Order;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOrderUpdated?: (order: any) => void;
  // Para controlar el diálogo externamente en modo edición
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function RegisterOrder({
  userId,
  onOrderCreated,
  mode = "create",
  existingOrder,
  onOrderUpdated,
  isOpen,
  onOpenChange,
}: RegisterOrderProps) {
  const [openDialog, setOpenDialog] = useState(false);

  // Usar el control externo del diálogo si se proporciona
  const dialogOpen = isOpen !== undefined ? isOpen : openDialog;
  const setDialogOpen = onOpenChange || setOpenDialog;

  const form = useForm<z.infer<typeof registerOrderSchema>>({
    resolver: zodResolver(registerOrderSchema),
    defaultValues: {
      code: "",
      machine: Machine.WANJIE,
      notes: "",
      dieCutter: "",
      stamping: "",
    },
  });

  // Cargar datos existentes cuando se cambia a modo edición
  useEffect(() => {
    if (mode === "edit" && existingOrder) {
      form.reset({
        code: existingOrder.code,
        machine: existingOrder.machine as $Enums.Machine,
        notes: existingOrder.notes || "",
        dieCutter: existingOrder.dieCutter || "",
        stamping: existingOrder.stamping || "",
      });
    } else if (mode === "create") {
      form.reset({
        code: "",
        machine: Machine.WANJIE,
        notes: "",
        dieCutter: "",
        stamping: "",
      });
    }
  }, [mode, existingOrder, form]);

  async function onSubmit(values: z.infer<typeof registerOrderSchema>) {
    console.log(
      `${mode === "edit" ? "Updating" : "Submitting"} order:`,
      values
    );
    try {
      let data;

      if (mode === "edit" && existingOrder) {
        data = await updateOrder({
          id: existingOrder.id,
          userId,
          code: values.code,
          machine: values.machine as $Enums.Machine,
          notes: values.notes,
          dieCutter: values.dieCutter,
          stamping: values.stamping,
        });
        toast.success("Parte de trabajo actualizado correctamente");
        onOrderUpdated?.(data);
      } else {
        data = await registerOrder({
          userId,
          code: values.code,
          machine: values.machine,
          notes: values.notes,
          dieCutter: values.dieCutter,
          stamping: values.stamping,
        });
        toast.success("Parte de trabajo registrado correctamente");
        onOrderCreated?.(data);
      }

      if (data) {
        form.reset();
        setDialogOpen(false);
      }
    } catch (error) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "submitting"} order:`,
        error
      );
      toast.error(
        `Error al ${
          mode === "edit" ? "actualizar" : "registrar"
        } el parte de trabajo`
      );
    }
  }

  const dialogContent = (
    <DialogContent>
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full border"
          aria-hidden="true"
        >
          {mode === "edit" ? (
            <Edit className="opacity-80" size={16} />
          ) : (
            <RefreshCcwIcon className="opacity-80" size={16} />
          )}
        </div>
        <DialogHeader>
          <DialogTitle className="sm:text-center">
            {mode === "edit" ? "Editar" : "Registro"}
          </DialogTitle>
          <DialogDescription className="sm:text-center">
            {mode === "edit"
              ? "Modifica la información del parte de trabajo."
              : "Ingresa la información del nuevo parte de trabajo."}
          </DialogDescription>
        </DialogHeader>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de Trabajo</FormLabel>
                <FormControl>
                  <Input placeholder="Código" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="machine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Máquina</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una máquina verificada para mostrar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(Machine).map((machine) => (
                      <SelectItem key={machine} value={machine}>
                        {machine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas</FormLabel>
                <FormControl>
                  <Input placeholder="Notas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="dieCutter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nº de troquel</FormLabel>
                <FormControl>
                  <Input placeholder="Nº de troquel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="stamping"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nº de estampación</FormLabel>
                <FormControl>
                  <Input placeholder="Nº de estampación" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button">
                {mode === "edit" ? "Actualizar" : "Registrar"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                  aria-hidden="true"
                >
                  <CircleCheckBig
                    className="opacity-80 text-emerald-600"
                    size={16}
                  />
                </div>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {mode === "edit"
                      ? "Confirmar actualización"
                      : "Confirmar registro"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {mode === "edit"
                      ? "¿Estás seguro de que deseas actualizar este pedido?"
                      : "¿Estás seguro de que deseas registrar este pedido?"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => form.handleSubmit(onSubmit)()}
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
    </DialogContent>
  );

  // Si es modo edición y se controla externamente, no mostrar el trigger
  if (mode === "edit" && isOpen !== undefined) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {dialogContent}
      </Dialog>
    );
  }

  // Modo normal con trigger
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="hover:cursor-pointer hover:scale-105 transition-transform mb-8">
          Registrar nuevo parte de trabajo
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
