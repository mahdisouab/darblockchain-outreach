import Link from "next/link";
import Button from "@/components/ui/Button";
import { homeMenuPreview } from "@/lib/menu-data";

const MenuPreview = () => {
  return (
    <section id="menu-apercu" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-inter text-xs uppercase tracking-[0.3em] text-bistro-terracotta mb-4">
            La carte
          </p>
          <h2 className="font-fraunces font-semibold text-bistro-charcoal text-4xl md:text-5xl">
            À la carte cette saison
          </h2>
          <p className="font-inter text-base text-bistro-graphite mt-4">
            Six entrées et plats qui changent au rythme du marché. Sélection
            actuelle.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {homeMenuPreview.map((dish) => (
            <article
              key={dish.name}
              className="group p-6 rounded-xl border border-bistro-charcoal/10 hover:border-bistro-forest/40 hover:shadow-md transition-all bg-bistro-cream/50"
            >
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-fraunces font-semibold text-xl text-bistro-charcoal leading-tight">
                  {dish.name}
                </h3>
                <span className="font-fraunces font-medium text-lg text-bistro-forest whitespace-nowrap">
                  {dish.price}
                </span>
              </div>
              <p className="font-inter text-sm text-bistro-graphite mt-3 leading-relaxed">
                {dish.description}
              </p>
            </article>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link href="/menu">
            <Button variant="outline" size="lg">
              Voir la carte complète →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;
