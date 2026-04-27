import { Star } from "lucide-react";

const reviews = [
  {
    name: "Camille L.",
    when: "il y a 2 semaines",
    initial: "C",
    text: "Une vraie découverte. Le Saint-Pierre était parfait, le service attentif sans en faire trop. Réservation facile, ambiance soignée. On y retournera.",
  },
  {
    name: "Thomas R.",
    when: "il y a 1 mois",
    initial: "T",
    text: "Excellent rapport qualité-prix pour le quartier. La carte change vraiment, ça fait plaisir. Mention spéciale pour la tarte aux abricots.",
  },
  {
    name: "Sarah B.",
    when: "il y a 3 semaines",
    initial: "S",
    text: "Le chef est venu en salle nous expliquer un plat. Ce genre de détails fait la différence. Très bonne adresse.",
  },
];

const Stars = ({ count = 5 }: { count?: number }) => (
  <div className="flex gap-0.5" aria-label={`Note ${count} sur 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < count
            ? "fill-bistro-terracotta text-bistro-terracotta"
            : "text-bistro-charcoal/20"
        }
      />
    ))}
  </div>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25c0-1.5-.2-3-.4-4.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5c-7.6 0-14.2 4.3-17.7 10.2z"
    />
    <path
      fill="#4CAF50"
      d="M24 45.5c5.4 0 10.3-2 14-5.4l-6.5-5.5c-2 1.4-4.6 2.4-7.5 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.7 41.1 16.3 45.5 24 45.5z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.5 5.5c-.5.4 7-5.1 7-14.1 0-1.5-.2-3-.4-4.5z"
    />
  </svg>
);

const ReviewsSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <p className="font-inter text-xs uppercase tracking-[0.3em] text-bistro-terracotta mb-4">
            Avis Google
          </p>
          <h2 className="font-fraunces font-semibold text-bistro-charcoal text-4xl md:text-5xl">
            Ce qu&apos;on dit de nous
          </h2>

          <div className="mt-10 inline-flex flex-col items-center">
            <p className="font-fraunces font-semibold text-7xl text-bistro-charcoal leading-none">
              4.7<span className="text-3xl text-bistro-graphite"> / 5</span>
            </p>
            <div className="mt-3">
              <Stars count={5} />
            </div>
            <div className="mt-4 flex items-center gap-2 font-inter text-sm text-bistro-graphite">
              <GoogleLogo /> sur 238 avis Google
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <article
              key={r.name}
              className="p-6 rounded-xl border border-bistro-charcoal/10 bg-bistro-cream/40 flex flex-col"
            >
              <Stars count={5} />
              <p className="font-inter text-sm text-bistro-charcoal mt-4 leading-relaxed flex-1">
                « {r.text} »
              </p>
              <div className="mt-5 pt-5 border-t border-bistro-charcoal/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bistro-terracotta text-white flex items-center justify-center font-fraunces font-semibold">
                  {r.initial}
                </div>
                <div>
                  <p className="font-inter font-medium text-sm text-bistro-charcoal">
                    {r.name}
                  </p>
                  <p className="font-inter text-xs text-bistro-graphite">
                    {r.when} · Avis Google
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
