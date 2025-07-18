"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "./animate-ui/radix/toggle-group";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SwitchTheme() {
  const { setTheme, theme } = useTheme();

  return (
    <div suppressHydrationWarning>
      <ToggleGroup
        type="single"
        defaultValue={theme}
        className="border shadow-md rounded-lg p-1"
        activeClassName="bg-primary/60"
      >
        <ToggleGroupItem
          value="light"
          onClick={() => setTheme("light")}
          aria-label="Toggle light mode"
        >
          <Sun className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="dark"
          onClick={() => setTheme("dark")}
          aria-label="Toggle dark mode"
        >
          <Moon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="system"
          onClick={() => setTheme("system")}
          aria-label="Toggle system mode"
        >
          <Monitor className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
