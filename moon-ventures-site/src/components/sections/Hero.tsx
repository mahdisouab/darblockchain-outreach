"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  const reduced = useReducedMotion();
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-mv-night text-white min-h-[700px] h-screen flex items-center"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(212,180,131,0.10),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.6),transparent_70%)]"
      />
      <svg
        aria-hidden
        viewBox="0 0 600 600"
        className="absolute -top-32 -right-24 w-[420px] h-[420px] -z-10 opacity-[0.06] blur-2xl"
      >
        <circle cx="300" cy="300" r="260" fill="#d4b483" />
      </svg>

      <div className="max-w-6xl mx-auto px-6 w-full text-center">
        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs font-medium uppercase tracking-[0.3em] text-mv-sand"
        >
          Agence digitale, Paris et Marseille
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: reduced ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display font-bold leading-[1.05] text-5xl md:text-7xl"
        >
          Le site qui ramène vos clients.
          <br />
          <span className="italic font-semibold text-mv-sand">
            Livré en 7 jours.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-8 text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
        >
          Pour les restaurants, cabinets de santé et artisans qui veulent
          reprendre la main sur leur acquisition. À partir de 990 €, agent IA
          inclus.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
        >
          <Button asChild variant="sand" size="lg">
            <Link href="#audit">Obtenir mon audit gratuit</Link>
          </Button>
          <Button asChild variant="ghostLight" size="lg">
            <Link href="#demo">Voir la démo</Link>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-12 text-[12px] tracking-wider text-white/50 uppercase"
        >
          4.9/5 sur les premiers clients · Engagement zéro sauf pack Scale ·
          Maquette gratuite avant signature
        </motion.p>
      </div>
    </section>
  );
}
