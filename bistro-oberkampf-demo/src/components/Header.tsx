"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Button from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/menu", label: "Menu" },
  { href: "/contact", label: "Contact" },
];

const Header = () => {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const reservationHref = pathname === "/" ? "#reservation" : "/#reservation";

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-bistro-cream/95 backdrop-blur-md shadow-sm"
            : "bg-bistro-cream/80 backdrop-blur"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="group">
            <span className="font-fraunces italic font-semibold text-xl md:text-2xl text-bistro-charcoal group-hover:text-bistro-forest transition-colors">
              Bistro Oberkampf
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-inter text-sm tracking-wide transition-colors ${
                    active
                      ? "text-bistro-forest font-medium"
                      : "text-bistro-charcoal hover:text-bistro-forest"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href={reservationHref}>
              <Button size="sm">Réserver</Button>
            </Link>
          </nav>

          <button
            onClick={() => setOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-bistro-charcoal/5 transition"
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        width="320px"
        ariaLabel="Menu principal"
      >
        <div className="px-8 pt-20 pb-10 flex flex-col gap-2">
          <span className="font-fraunces italic text-lg text-bistro-graphite mb-6">
            Bistro Oberkampf
          </span>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-fraunces text-2xl text-bistro-charcoal hover:text-bistro-forest py-3 border-b border-bistro-charcoal/10"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={reservationHref}
            onClick={() => setOpen(false)}
            className="mt-6"
          >
            <Button size="md" className="w-full">
              Réserver une table
            </Button>
          </Link>
        </div>
      </Sheet>
    </>
  );
};

export default Header;
