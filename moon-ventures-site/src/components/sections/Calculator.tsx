import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { CalculateurPlateformes } from "@/components/CalculateurPlateformes";

export function CalculatorSection() {
  return (
    <Section id="calculateur" className="bg-mv-cream">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-mv-sand">
          Calcul en direct
        </p>
        <h2 className="mt-4 font-display font-semibold text-mv-ink text-4xl md:text-5xl leading-tight max-w-3xl">
          Combien les plateformes vous coûtent{" "}
          <span className="italic text-mv-sand">vraiment</span>&nbsp;?
        </h2>
        <p className="mt-6 text-mv-graphite max-w-2xl text-lg leading-relaxed">
          Trois curseurs, votre chiffre annuel. C&rsquo;est gratuit,
          c&rsquo;est instantané, c&rsquo;est conservateur. Et c&rsquo;est ce
          que la plupart des restaurateurs n&rsquo;ont jamais regardé en face.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12">
          <CalculateurPlateformes variant="landing" />
        </div>
      </Reveal>
    </Section>
  );
}
