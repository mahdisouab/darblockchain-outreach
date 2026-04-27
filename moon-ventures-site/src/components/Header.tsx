"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Approche", href: "/#approche" },
  { label: "Tarifs", href: "/#tarifs" },
  { label: "Démo", href: "/#demo" },
  { label: "Contact", href: "/#audit" },
];

export function Header() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-mv-mist/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl font-semibold text-mv-ink tracking-tight"
        >
          Moon Ventures
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-mv-graphite hover:text-mv-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm">
            <Link href="/#audit">Audit gratuit</Link>
          </Button>
        </nav>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md text-mv-ink hover:bg-mv-cream"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-mv-mist/60 bg-white transition-[max-height,opacity] duration-300 ease-out",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col px-6 py-6 gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base text-mv-ink"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild>
            <Link href="/#audit" onClick={() => setOpen(false)}>
              Audit gratuit
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
