import type { Metadata } from "next";
import Link from "next/link";
import { CalculateurPlateformes } from "@/components/CalculateurPlateformes";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Calculateur de pertes plateformes",
  description:
    "TheFork, UberEats, Deliveroo : combien ces plateformes vous coûtent vraiment chaque année ? Calculateur gratuit Moon Ventures.",
  openGraph: {
    title:
      "Calculateur de pertes plateformes — Moon Ventures",
    description:
      "TheFork, UberEats, Deliveroo : combien ces plateformes vous coûtent vraiment chaque année ?",
    type: "website",
    url: "https://moon-ventures.fr/calculateur",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Calculateur Moon Ventures",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculateur de pertes plateformes — Moon Ventures",
    description:
      "TheFork, UberEats, Deliveroo : combien ces plateformes vous coûtent vraiment chaque année ?",
    images: ["/og.png"],
  },
};

export default function CalculateurPage() {
  return (
    <>
      <Section className="bg-mv-cream pb-12 md:pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mv-sand">
            Calcul en direct
          </p>
          <h1 className="mt-4 font-display font-semibold italic text-mv-ink text-4xl md:text-5xl leading-tight">
            Combien les plateformes vous coûtent vraiment&nbsp;?
          </h1>
          <p className="mt-6 text-mv-graphite text-lg leading-relaxed">
            Trois curseurs, votre chiffre annuel. Gratuit, instantané,
            conservateur. Pensé pour les restaurateurs qui paient TheFork,
            UberEats et Deliveroo sans jamais avoir vraiment regardé la
            facture cumulée.
          </p>
        </div>
      </Section>

      <section className="bg-mv-cream pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <CalculateurPlateformes variant="standalone" />
        </div>
      </section>

      <Section className="bg-white">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mv-sand">
            Vous êtes restaurateur à Paris&nbsp;?
          </p>
          <h2 className="mt-4 font-display font-semibold text-mv-ink text-3xl md:text-4xl leading-tight">
            On vous livre les chiffres réels en moins de 24 heures.
          </h2>
          <p className="mt-5 text-mv-graphite text-lg leading-relaxed">
            L&rsquo;audit Moon Ventures reprend ces hypothèses, les confronte à
            votre activité réelle, et identifie 3 priorités pour reprendre la
            main sur votre acquisition. Sans engagement, sans devis surprise.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/#audit"
              className="inline-flex items-center justify-center bg-mv-night text-white font-medium px-6 py-3 rounded-full hover:bg-black transition-colors"
            >
              Réserver mon audit
            </Link>
            <Link
              href="/#tarifs"
              className="inline-flex items-center justify-center border border-mv-ink text-mv-ink font-medium px-6 py-3 rounded-full hover:bg-mv-ink hover:text-white transition-colors"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
