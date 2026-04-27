import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Leaf, Wheat, Fish } from "lucide-react";
import { fullMenu } from "@/lib/menu-data";

export const metadata: Metadata = {
  title: "La carte",
  description:
    "Carte saisonnière du Bistro Oberkampf : entrées, plats, desserts, vins et boissons.",
};

const updatedDate = new Date().toLocaleDateString("fr-FR", {
  dateStyle: "long",
});

const Allergens = () => (
  <div className="flex items-center gap-3 text-bistro-graphite/60">
    <span className="flex items-center gap-1 text-xs">
      <Wheat size={12} /> Gluten
    </span>
    <span className="flex items-center gap-1 text-xs">
      <Fish size={12} /> Poisson
    </span>
    <span className="flex items-center gap-1 text-xs">
      <Leaf size={12} /> Végétarien
    </span>
  </div>
);

export default function MenuPage() {
  return (
    <>
      <section className="relative h-64 md:h-72 flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2400&q=80"
          alt="Service en salle au Bistro Oberkampf"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-bistro-charcoal/55" />
        <div className="relative z-10 text-center px-6">
          <p className="font-inter text-xs uppercase tracking-[0.3em] text-white/80 mb-3">
            Saison printemps · été
          </p>
          <h1 className="font-fraunces font-semibold italic text-white text-5xl md:text-6xl">
            La carte
          </h1>
        </div>
      </section>

      <section className="py-20 bg-bistro-cream">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {fullMenu.map((section) => (
            <div key={section.title} className="mb-16 last:mb-4">
              <div className="flex items-center justify-center gap-4 mb-10">
                <span className="h-px w-12 bg-bistro-terracotta/50" />
                <h2 className="font-fraunces font-semibold text-3xl md:text-4xl text-bistro-charcoal text-center">
                  {section.title}
                </h2>
                <span className="h-px w-12 bg-bistro-terracotta/50" />
              </div>

              <ul className="space-y-7">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <div className="flex items-baseline">
                      <h3 className="font-fraunces font-semibold text-lg text-bistro-charcoal">
                        {item.name}
                      </h3>
                      <span
                        className="menu-leader"
                        aria-hidden="true"
                      />
                      <span className="font-fraunces font-medium text-lg text-bistro-forest whitespace-nowrap">
                        {item.price}
                      </span>
                    </div>
                    <p className="font-inter text-sm text-bistro-graphite mt-1.5 leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>

              {section.title === "Boissons" && (
                <p className="font-inter italic text-sm text-bistro-graphite mt-8 text-center">
                  Carte des vins complète sur demande.
                </p>
              )}
            </div>
          ))}

          <div className="mt-12 pt-8 border-t border-bistro-charcoal/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Allergens />
            <p className="font-inter text-xs text-bistro-graphite">
              Carte mise à jour le {updatedDate}
            </p>
          </div>
        </div>
      </section>

      <Link
        href="/#reservation"
        className="fixed bottom-6 right-24 md:right-28 z-30 hidden sm:inline-flex items-center gap-2 h-12 px-6 rounded-full bg-bistro-forest text-white font-inter font-medium text-sm shadow-lg hover:bg-bistro-charcoal transition"
      >
        Réserver une table →
      </Link>
    </>
  );
}
