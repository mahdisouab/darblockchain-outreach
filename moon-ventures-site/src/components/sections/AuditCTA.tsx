import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { CalEmbed } from "@/components/CalEmbed";
import { AuditForm } from "@/components/AuditForm";

export function AuditCTA() {
  return (
    <Section id="audit" className="bg-mv-cream">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-mv-sand">
          Prochaine étape
        </p>
        <h2 className="mt-4 font-display font-semibold italic text-mv-ink text-5xl md:text-6xl leading-[1.05] max-w-4xl">
          Votre audit digital, gratuit, en 24 heures.
        </h2>
        <p className="mt-6 text-mv-graphite max-w-2xl text-lg leading-relaxed">
          Vous nous donnez l&rsquo;URL de votre site actuel et le nom de votre
          établissement sur Google. Nous livrons un PDF personnalisé qui
          chiffre vos pertes plateformes, identifie 3 priorités, et estime ce
          que Moon Ventures peut vous faire gagner. Aucune obligation.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <CalEmbed />
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-2">
          <AuditForm />
        </Reveal>
      </div>
    </Section>
  );
}
