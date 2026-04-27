import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Audit gratuit, 24 h",
    body:
      "Vous nous donnez votre URL et le nom de votre Google Business. Nous livrons un PDF d'audit personnalisé qui chiffre vos pertes.",
  },
  {
    n: "02",
    title: "Maquette, 48 h",
    body:
      "Nous générons une v1 de votre site, à votre nom, avant tout engagement. Vous voyez le résultat avant de payer.",
  },
  {
    n: "03",
    title: "Production, 7 à 14 jours",
    body:
      "Une fois la maquette validée, nous finalisons le site, intégrons l'agent IA et préparons le déploiement.",
  },
  {
    n: "04",
    title: "Mise en ligne et suivi",
    body:
      "Votre site passe en production sur votre domaine. Maintenance et améliorations continues incluses dans le mensuel.",
  },
];

export function Process() {
  return (
    <Section className="bg-mv-cream">
      <Reveal>
        <h2 className="font-display font-semibold text-mv-ink text-4xl md:text-5xl leading-tight max-w-3xl">
          De la première conversation au site en ligne.
        </h2>
        <p className="mt-6 text-mv-graphite max-w-2xl text-lg leading-relaxed">
          4 étapes, 7 à 14 jours selon le pack. Vous payez 50 % à la commande,
          50 % à la livraison.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-10 md:grid-cols-4 relative">
        <div
          aria-hidden
          className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-mv-mist"
        />
        {STEPS.map((step, i) => (
          <Reveal key={step.n} delay={i * 0.1}>
            <div className="relative bg-mv-cream pr-2">
              <span className="font-display font-bold text-mv-sand text-5xl md:text-6xl block leading-none">
                {step.n}
              </span>
              <h3 className="mt-4 font-display font-semibold text-mv-ink text-xl">
                {step.title}
              </h3>
              <p className="mt-3 text-mv-graphite leading-relaxed text-[15px]">
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
