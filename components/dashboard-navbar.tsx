"use client";

import { CalendarRange, HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { SwitchTheme } from "./mode-toggle";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import NavbarMenuIcon from "./navbar-menu-icon";
import ProfileDialog from "./profile-dialog";

// Navigation links with icons for desktop icon-only navigation
const navigationLinks = [
  { href: "/dashboard", label: "Inicio", icon: HomeIcon },
  { href: "/dashboard/calendar", label: "Calendario", icon: CalendarRange },
];

export default function DashboardNavbar() {
  const { data: session } = useSession();

  const pathname = usePathname();
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <NavbarMenuIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink
                          href={link.href}
                          className="flex-row items-center gap-2 py-1.5"
                          active={pathname === link.href}
                        >
                          <Icon
                            size={16}
                            className="text-muted-foreground"
                            aria-hidden="true"
                          />
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Logo */}
          <Link href="/">
            <Image
              src={"/logo.webp"}
              alt="Logo"
              className="object-contain"
              width={200}
              height={50}
            />
          </Link>
          {/* Desktop navigation - icon only */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <NavigationMenu>
              <NavigationMenuList className="gap-4">
                <TooltipProvider>
                  {navigationLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavigationMenuItem key={link.label}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <NavigationMenuLink
                              href={link.href}
                              className="flex size-10 items-center justify-center p-1"
                            >
                              <Icon
                                size={28}
                                style={{ width: 28, height: 28 }}
                                aria-hidden="true"
                              />
                              <span className="sr-only">{link.label}</span>
                            </NavigationMenuLink>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="px-2 py-1 text-xs"
                          >
                            <p>{link.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      </NavigationMenuItem>
                    );
                  })}
                </TooltipProvider>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-6">
          {/* Theme toggle */}
          <SwitchTheme />
          {/* User menu */}
          {session && <ProfileDialog session={session} />}
        </div>
      </div>
    </header>
  );
}
