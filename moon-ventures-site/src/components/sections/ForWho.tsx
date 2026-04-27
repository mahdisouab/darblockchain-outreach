import { Utensils, Stethoscope, Wrench } from "lucide-react";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PROFILES = [
  {
    icon: Utensils,
    title: "Restaurants indépendants",
    description:
      "Vous payez 15 à 30 % de commission à TheFork et UberEats sans jamais récupérer vos clients.",
    pain: "Pas de relation client directe.",
    delivered:
      "Site avec module de réservation directe, agent IA qui répond et qui relance les no-shows.",
  },
  {
    icon: Stethoscope,
    title: "Cabinets et praticiens",
    description:
      "Votre secrétariat passe trois heures par jour au téléphone. Vos patients ne rappellent pas.",
    pain: "Demandes perdues, agenda saturé.",
    delivered:
      "Prise de RDV en ligne, agent IA qui qualifie 80 % des demandes, rappels SMS automatiques.",
  },
  {
    icon: Wrench,
    title: "Artisans et services",
    description:
      "Vos devis restent sans réponse. Votre acquisition repose à 100 % sur le bouche-à-oreille.",
    pain: "Aucune trace digitale, aucune relance.",
    delivered:
      "Site vitrine local, formulaire de devis, relance automatique des demandes non converties.",
  },
];

export function ForWho() {
  return (
    <Section id="approche" className="bg-white">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-mv-sand">
          Trois métiers que nous comprenons
        </p>
        <h2 className="mt-4 font-display font-semibold text-mv-ink text-4xl md:text-5xl leading-tight max-w-3xl">
          Vous avez une vraie activité. Votre site n&rsquo;a pas suivi.
        </h2>
        <p className="mt-6 text-mv-graphite max-w-3xl text-lg leading-relaxed">
          Nous intervenons sur trois verticales que nous connaissons en détail.
          Pas de site corporate générique. Chaque pack est calibré pour le
          métier&nbsp;: modules, contenus, intégrations, agent IA paramétré.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {PROFILES.map((profile, i) => (
          <Reveal key={profile.title} delay={i * 0.08}>
            <Card className="h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-mv-cream flex items-center justify-center text-mv-ink">
                  <profile.icon className="h-6 w-6" />
                </div>
                <CardTitle>{profile.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-mv-graphite leading-relaxed">
                  {profile.description}
                </p>
                <p className="font-display italic text-mv-sand">
                  Douleur typique&nbsp;: {profile.pain}
                </p>
                <div className="pt-2 border-t border-mv-mist">
                  <p className="text-sm uppercase tracking-wider text-mv-graphite/70 mb-2">
                    Ce que nous livrons
                  </p>
                  <p className="text-mv-ink leading-relaxed">
                    {profile.delivered}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
