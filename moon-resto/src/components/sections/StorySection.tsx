import Image from "next/image";

const StorySection = () => {
  return (
    <section className="py-24 bg-bistro-cream">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 grid gap-12 md:grid-cols-2 md:gap-16 items-center">
        <div>
          <p className="font-inter text-xs uppercase tracking-[0.3em] text-bistro-terracotta mb-4">
            Depuis 2019
          </p>
          <h2 className="font-fraunces font-semibold text-bistro-charcoal text-4xl md:text-5xl leading-tight">
            Une cuisine, un quartier,
            <br />
            <span className="italic">une exigence</span>
          </h2>
          <p className="font-inter text-base text-bistro-graphite mt-6 leading-relaxed">
            Bistro Oberkampf est né d&apos;une obsession simple : cuisiner au
            plus près des saisons, avec des produits sourcés à Rungis le matin
            et chez les producteurs d&apos;Île-de-France. Le chef Antoine
            Lefèvre, formé entre Paris et Lyon, signe une carte qui change six
            fois par an. Quarante-deux couverts, une équipe de huit, et
            l&apos;envie de bien faire.
          </p>
          <div className="mt-8 flex gap-8 pt-6 border-t border-bistro-charcoal/10">
            <div>
              <p className="font-fraunces font-semibold text-3xl text-bistro-forest">
                42
              </p>
              <p className="font-inter text-xs uppercase tracking-wider text-bistro-graphite">
                Couverts
              </p>
            </div>
            <div>
              <p className="font-fraunces font-semibold text-3xl text-bistro-forest">
                6×
              </p>
              <p className="font-inter text-xs uppercase tracking-wider text-bistro-graphite">
                Cartes / an
              </p>
            </div>
            <div>
              <p className="font-fraunces font-semibold text-3xl text-bistro-forest">
                4.7
              </p>
              <p className="font-inter text-xs uppercase tracking-wider text-bistro-graphite">
                Note Google
              </p>
            </div>
          </div>
        </div>

        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=1200&q=80"
            alt="Plat dressé par le chef"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default StorySection;
