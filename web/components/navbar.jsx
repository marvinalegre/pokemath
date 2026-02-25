"use client";

import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { IconMenu2, IconBolt, IconUser } from "@tabler/icons-react";

const DEFAULT_USERNAME = "user9asug93";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const username = DEFAULT_USERNAME;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <IconBolt className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base tracking-tight">PokéMath</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/catch"
                  className={navigationMenuTriggerStyle()}
                  style={{ background: "transparent" }}
                >
                  Catch
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/players"
                  className={navigationMenuTriggerStyle()}
                  style={{ background: "transparent" }}
                >
                  Players
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex md:items-center md:gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground">
            <IconUser className="h-3.5 w-3.5" />
            <span className="font-mono text-xs font-medium text-foreground">
              {username}
            </span>
          </div>
          <Button size="sm" asChild>
            <a href="/signup">Sign up</a>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <IconMenu2 className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] sm:w-[340px] px-6 py-6"
            >
              <SheetHeader className="mb-4">
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                    <IconBolt className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  PokéMath
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1">
                <a
                  href="/catch"
                  className="py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Catch
                </a>
                <a
                  href="/players"
                  className="py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Players
                </a>
              </nav>

              <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2.5">
                  <IconUser className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      Temporary account (will be deleted)
                    </span>
                    <span className="font-mono text-sm font-medium text-foreground">
                      {username}
                    </span>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <a href="/signup" onClick={() => setMobileOpen(false)}>
                    Sign up
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
