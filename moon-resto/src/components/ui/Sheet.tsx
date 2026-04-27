"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  side?: "right" | "left";
  width?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}

export const Sheet = ({
  open,
  onClose,
  side = "right",
  width = "420px",
  children,
  ariaLabel,
}: SheetProps) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const x = side === "right" ? "100%" : "-100%";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-bistro-charcoal/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x }}
            animate={{ x: 0 }}
            exit={{ x }}
            transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className={`fixed top-0 ${
              side === "right" ? "right-0" : "left-0"
            } bottom-0 z-[61] bg-bistro-cream shadow-2xl flex flex-col w-full sm:w-[var(--sheet-w)]`}
            style={{ ["--sheet-w" as string]: width }}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
          >
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-bistro-charcoal flex items-center justify-center shadow-sm transition"
            >
              <X size={18} />
            </button>
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
