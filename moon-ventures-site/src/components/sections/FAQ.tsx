import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ITEMS = [
  {
    q: "À qui appartient le site une fois livré ?",
    a: "Vous. Le code, le contenu, le nom de domaine, tout vous appartient. Vous pouvez à tout moment exporter le site et changer de prestataire sans dépendance technique.",
  },
  {
    q: "Pourquoi vos prix sont-ils dix fois moins chers que les agences classiques ?",
    a: "Parce que nous avons industrialisé la production avec des outils IA propriétaires. Une agence classique facture le temps de ses graphistes et développeurs. Nous facturons un livrable. Les économies sont réelles, pas un compromis sur la qualité.",
  },
  {
    q: "Que se passe-t-il si je ne suis pas satisfait de la maquette ?",
    a: "Vous ne payez rien. La maquette v1 est offerte avant tout engagement. Si elle ne vous convient pas, vous gardez les visuels et nous nous séparons sans frais.",
  },
  {
    q: "Comment fonctionne l'agent IA inclus dans le pack Growth ?",
    a: "L'agent IA est entraîné sur vos contenus (carte, prestations, FAQ). Il répond aux visiteurs 24/7, qualifie les demandes, prend les réservations ou rendez-vous, et relance les clients. Il s'améliore avec chaque conversation.",
  },
  {
    q: "Y a-t-il un engagement de durée ?",
    a: "Non sur Starter et Growth. Vous pouvez résilier le mensuel à tout moment avec un préavis d'un mois. Le pack Scale demande un engagement de 6 mois pour amortir les développements sur mesure.",
  },
  {
    q: "Comment êtes-vous différents d'un site fait sur Wix ou Shopify ?",
    a: "Wix et Shopify sont des outils. Nous sommes une équipe. Vous êtes accompagné de la stratégie au déploiement, votre site est conçu pour votre métier, et vous bénéficiez d'un agent IA qu'aucune plateforme grand public ne propose à ce niveau.",
  },
];

export function FAQ() {
  return (
    <Section className="bg-white">
      <Reveal>
        <h2 className="font-display font-semibold text-mv-ink text-4xl md:text-5xl leading-tight max-w-2xl">
          Les questions qui reviennent.
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 max-w-3xl">
          <Accordion type="single" collapsible>
            {ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-mv-graphite leading-relaxed">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Reveal>
    </Section>
  );
}
