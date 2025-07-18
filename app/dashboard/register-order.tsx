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
import { CircleCheckBig, RefreshCcwIcon } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Machine } from "@prisma/client";
import { toast } from "sonner";
import { registerOrder } from "@/lib/actions/register-order";
import { useState } from "react";

const registerOrderSchema = z.object({
  code: z.string().min(1, "El código es obligatorio"),
  machine: z.enum(Machine, { error: "Selecciona una máquina verificada" }),
  notes: z.string().optional(),
  dieCutter: z.string().optional(),
  stamping: z.string().optional(),
});

interface RegisterOrderProps {
  userId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOrderCreated?: (order: any) => void;
}

export default function RegisterOrder({
  userId,
  onOrderCreated,
}: RegisterOrderProps) {
  const [openDialog, setOpenDialog] = useState(false);

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

  async function onSubmit(values: z.infer<typeof registerOrderSchema>) {
    console.log("Submitting order:", values);
    try {
      const data = await registerOrder({
        userId,
        code: values.code,
        machine: values.machine as Machine,
        notes: values.notes,
        dieCutter: values.dieCutter,
        stamping: values.stamping,
      });

      if (data) {
        toast.success("Parte de trabajo registrado correctamente");
        form.reset();
        setOpenDialog(false);
        onOrderCreated?.(data);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Error al registrar el parte de trabajo");
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="hover:cursor-pointer hover:scale-105 transition-transform mb-8">
          Registrar nuevo parte de trabajo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <RefreshCcwIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Registro</DialogTitle>
            <DialogDescription className="sm:text-center">
              Ingresa la información del nuevo parte de trabajo.
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
                <Button type="button">Registrar</Button>
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
                    <AlertDialogTitle>Confirmar registro</AlertDialogTitle>
                    <AlertDialogDescription>
                      ¿Estás seguro de que deseas registrar este pedido?
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
    </Dialog>
  );
}
