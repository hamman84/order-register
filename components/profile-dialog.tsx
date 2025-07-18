"use client";

import {
  ChevronDownIcon,
  Loader2,
  LogOut,
  LogOutIcon,
  Settings2,
  UserPenIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar as MenuAvatar,
  AvatarFallback,
  AvatarImage,
  Avatar,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "better-auth";
import { ChangePassword, EditUserDialog } from "./user-profile";
import { Session } from "@/lib/auth";
import { Button } from "./ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfileDialogProps {
  session: Session;
}

export default function ProfileDialog({ session }: ProfileDialogProps) {
  const user = session.user as User;
  const [isSignOut, setIsSignOut] = useState(false);
  const router = useRouter();

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <MenuAvatar className="h-12 w-12 shadow-md">
              <AvatarImage src={user.image || ""} alt="Profile image" />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </MenuAvatar>
            <ChevronDownIcon
              size={24}
              className="opacity-60"
              aria-hidden="true"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64">
          <DropdownMenuLabel className="flex min-w-0 flex-col">
            <span className="text-foreground truncate text-sm font-medium">
              {user.name}
            </span>
            <span className="text-muted-foreground truncate text-xs font-normal">
              {user.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <DialogTrigger className="flex w-full items-center gap-2">
                <UserPenIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Perfil</span>
              </DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings2 size={16} className="opacity-60" aria-hidden="true" />
              <span>Opciones</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Información del usuario</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-12">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex ">
                <AvatarImage
                  src={session?.user.image || undefined}
                  alt="Avatar"
                  className="object-cover"
                />
                <AvatarFallback>{session?.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium leading-none">
                    {session?.user.name}
                  </p>
                </div>
                <p className="text-sm">{session?.user.email}</p>
              </div>
            </div>
            <EditUserDialog />
          </div>
          <ChangePassword />
          <Button
            className="gap-2 z-10"
            variant="secondary"
            onClick={async () => {
              setIsSignOut(true);
              await signOut({
                fetchOptions: {
                  onSuccess() {
                    router.push("/");
                  },
                },
              });
              setIsSignOut(false);
            }}
            disabled={isSignOut}
          >
            <span className="text-sm">
              {isSignOut ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <LogOut size={16} />
                  Cerrar sesión
                </div>
              )}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
