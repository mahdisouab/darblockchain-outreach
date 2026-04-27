import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export function Demo() {
  return (
    <section
      id="demo"
      className="bg-mv-night text-white py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-6 grid gap-12 md:grid-cols-2 items-center">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-mv-sand">
            Une démo vaut mille promesses
          </p>
          <h2 className="mt-4 font-display font-semibold italic text-4xl md:text-5xl leading-tight">
            Voilà à quoi ressemble un site Moon Ventures.
          </h2>
          <p className="mt-6 text-white/80 max-w-xl text-lg leading-relaxed">
            Bistro Oberkampf est une démonstration que nous avons construite
            pour illustrer notre pack Growth pour la restauration. Site
            complet, agent IA fonctionnel, déployé en moins de 14 jours.
          </p>

          <div className="mt-8 flex flex-col items-start gap-3">
            <Button asChild variant="sand" size="lg">
              <a
                href="https://bistro-oberkampf.moon-ventures.fr"
                target="_blank"
                rel="noopener noreferrer"
              >
                Voir la démo en plein écran
              </a>
            </Button>
            <p className="text-sm text-white/70 max-w-md">
              Pas votre métier&nbsp;? Nous adaptons à votre secteur en moins de
              14 jours.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <LaptopMockup />
        </Reveal>
      </div>
    </section>
  );
}

function LaptopMockup() {
  return (
    <div className="relative">
      <div className="rounded-2xl border border-white/10 bg-mv-ink/80 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 bg-mv-night/80 border-b border-white/10 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          </div>
          <div className="flex-1 mx-4 bg-white/5 rounded-md text-[11px] text-white/60 px-3 py-1 truncate">
            bistro-oberkampf.moon-ventures.fr
          </div>
        </div>
        <div className="aspect-[16/10] bg-gradient-to-br from-[#1a0f0a] via-mv-night to-black p-8 flex flex-col justify-between">
          <div>
            <p className="font-display italic text-mv-sand text-sm tracking-wider uppercase">
              Bistro Oberkampf · Paris 11e
            </p>
            <h3 className="mt-3 font-display font-semibold text-white text-3xl md:text-4xl leading-tight">
              Cuisine de marché.
              <br />
              Réservation directe.
            </h3>
            <div className="mt-6 flex gap-3">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-mv-sand text-mv-ink text-xs font-semibold">
                Réserver une table
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full border border-white/30 text-white text-xs">
                Voir le menu
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="h-12 rounded bg-white/5" />
            <div className="h-12 rounded bg-white/10" />
            <div className="h-12 rounded bg-mv-sand/20" />
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="mx-auto mt-1 h-2 w-3/4 rounded-b-xl bg-white/10"
      />
    </div>
  );
}
