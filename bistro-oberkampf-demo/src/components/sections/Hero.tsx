"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

const Hero = () => {
  return (
    <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2400&q=80"
        alt="Salle du Bistro Oberkampf en soirée"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-bistro-charcoal/40" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 px-6 max-w-4xl mx-auto text-center"
      >
        <p className="font-inter text-sm uppercase tracking-[0.3em] text-white/80 mb-5">
          Paris 11 — depuis 2019
        </p>
        <h1 className="font-fraunces font-semibold italic text-white text-5xl md:text-7xl leading-[1.05]">
          Cuisine de saison,
          <br />à deux pas d&apos;Oberkampf
        </h1>
        <p className="font-inter font-normal text-lg md:text-xl text-white/90 mt-6 max-w-2xl mx-auto">
          Bistrot parisien, ouvert midi et soir du mardi au samedi.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="#reservation">
            <Button size="lg" className="w-full sm:w-auto">
              Réserver une table
            </Button>
          </Link>
          <Link href="#menu-apercu">
            <Button variant="ghost-light" size="lg" className="w-full sm:w-auto">
              Voir le menu
            </Button>
          </Link>
        </div>
      </motion.div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 font-inter text-xs uppercase tracking-widest"
        aria-hidden="true"
      >
        ↓ Découvrir
      </div>
    </section>
  );
};

export default Hero;
