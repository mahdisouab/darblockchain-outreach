import Link from "next/link";
import { Check } from "lucide-react";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Pack = {
  name: string;
  target: string;
  price: string;
  monthly: string;
  features: string[];
  delivery: string;
  cta: string;
  variant: "ghost" | "primary";
  highlight?: boolean;
};

const PACKS: Pack[] = [
  {
    name: "Starter",
    target: "Artisans, indépendants",
    price: "990 €",
    monthly: "+ 79 € HT/mois",
    features: [
      "Site 5 pages responsive",
      "Module de contact intelligent",
      "SEO local optimisé",
      "Hébergement et nom de domaine",
      "Maintenance et sauvegardes",
    ],
    delivery: "Livraison 7 jours",
    cta: "Choisir Starter",
    variant: "ghost",
  },
  {
    name: "Growth",
    target: "Restaurants, cabinets, salons",
    price: "2 490 €",
    monthly: "+ 149 € HT/mois",
    features: [
      "Tout Starter",
      "Module de réservation ou prise de RDV",
      "Agent IA conversationnel inclus",
      "Page menu ou catalogue de prestations",
      "Intégration Google Business",
      "Tracking conversions",
      "1 mois d'agent IA offert",
    ],
    delivery: "Livraison 10 à 14 jours",
    cta: "Choisir Growth",
    variant: "primary",
    highlight: true,
  },
  {
    name: "Scale",
    target: "PME 10 à 50, e-commerce",
    price: "4 990 €",
    monthly: "+ 299 € HT/mois",
    features: [
      "Tout Growth",
      "E-commerce ou modules métier sur mesure",
      "Multi-langue",
      "Agent IA personnalisé sur vos données",
      "Tracking CA généré",
      "Reporting mensuel",
      "Engagement 6 mois",
    ],
    delivery: "Livraison 21 jours",
    cta: "Choisir Scale",
    variant: "ghost",
  },
];

export function Pricing() {
  return (
    <Section id="tarifs" className="bg-white">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-mv-sand">
          3 packs, prix publics
        </p>
        <h2 className="mt-4 font-display font-semibold text-mv-ink text-4xl md:text-5xl leading-tight max-w-3xl">
          Choisissez votre niveau d&rsquo;engagement.
        </h2>
        <p className="mt-6 text-mv-graphite max-w-2xl text-lg leading-relaxed">
          Les prix sont publics. Pas de devis sur demande, pas de surprise.
          Maquette gratuite incluse partout.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-3 items-stretch">
        {PACKS.map((pack, i) => (
          <Reveal key={pack.name} delay={i * 0.08}>
            <Card
              className={cn(
                "h-full p-8 flex flex-col relative",
                pack.highlight ? "border-2 border-mv-sand" : "border"
              )}
            >
              {pack.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-mv-sand text-mv-ink text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
                  Recommandé
                </span>
              )}

              <div>
                <h3 className="font-display font-semibold text-mv-ink text-2xl">
                  {pack.name}
                </h3>
                <p className="mt-1 italic text-mv-graphite text-sm">
                  {pack.target}
                </p>
              </div>

              <div className="mt-6">
                <p className="font-display font-bold text-mv-ink text-5xl md:text-6xl leading-none">
                  {pack.price}
                </p>
                <p className="mt-2 text-mv-graphite text-sm">HT setup</p>
                <p className="text-mv-graphite text-sm">{pack.monthly}</p>
              </div>

              <ul className="mt-8 space-y-3 flex-1">
                {pack.features.map((f) => (
                  <li
                    key={f}
                    className="flex gap-3 text-[15px] leading-relaxed text-mv-ink"
                  >
                    <Check
                      aria-hidden
                      className="h-5 w-5 shrink-0 text-mv-forest mt-0.5"
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-sm uppercase tracking-wider text-mv-graphite/80">
                {pack.delivery}
              </p>

              <div className="mt-6">
                <Button
                  asChild
                  variant={pack.variant === "primary" ? "sand" : "outline"}
                  className="w-full"
                >
                  <Link href="#audit">{pack.cta}</Link>
                </Button>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-mv-graphite max-w-2xl mx-auto">
        Tous les prix sont en hors taxes. TVA française 20 % applicable.
        Paiement 50 % à la commande, 50 % à la livraison.
      </p>
    </Section>
  );
}
