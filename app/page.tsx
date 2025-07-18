import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="container mx-auto p-4">
      <h1>Registro de partes de trabajo</h1>
      <p>
        Bienvenido al sistema de registro de partes de trabajo. Aquí puedes
        gestionar y realizar un seguimiento de tus partes de trabajo de manera
        eficiente.
      </p>
      {!session ? (
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/sign-in">Iniciar sesión</Link>
          </Button>
          <Button asChild variant="outline" className="ml-2">
            <Link href="/sign-up">Registrarse</Link>
          </Button>
        </div>
      ) : (
        <Button asChild>
          <Link href="/dashboard">Ir al Dashboard</Link>
        </Button>
      )}
    </div>
  );
}
