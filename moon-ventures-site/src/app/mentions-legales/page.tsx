import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales de Moon Ventures SAS, agence digitale française.",
};

export default function MentionsLegalesPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-24 md:py-32">
      <header className="mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-mv-sand">
          Informations légales
        </p>
        <h1 className="mt-4 font-display font-semibold text-mv-ink text-4xl md:text-5xl leading-tight">
          Mentions légales
        </h1>
      </header>

      <div className="space-y-12 text-mv-graphite leading-relaxed">
        <section>
          <h2 className="font-display text-2xl font-semibold text-mv-ink mb-4">
            Éditeur du site
          </h2>
          <p>
            Le site moon-ventures.fr est édité par Moon Ventures SAS, société
            par actions simplifiée au capital de 22 222 €, dont le siège social
            est situé au 28 Boulevard de la Corderie, 13007 Marseille.
          </p>
          <ul className="mt-4 space-y-1.5 text-mv-ink">
            <li>SIRET&nbsp;: 101 349 033 00015</li>
            <li>TVA intracommunautaire&nbsp;: FR29101349033</li>
            <li>Code APE / NAF&nbsp;: 6201Z</li>
            <li>Directeur de la publication&nbsp;: Mahdi Souab</li>
            <li>
              Contact&nbsp;:{" "}
              <a
                className="text-mv-ink underline underline-offset-2 hover:text-mv-sand"
                href="mailto:contact@moon-ventures.fr"
              >
                contact@moon-ventures.fr
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-mv-ink mb-4">
            Hébergeur
          </h2>
          <p>
            Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut,
            CA 91789, États-Unis.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-mv-ink mb-4">
            Propriété intellectuelle
          </h2>
          <p>
            L&rsquo;ensemble des contenus (textes, images, logos, illustrations,
            code source) présents sur ce site est la propriété exclusive de
            Moon Ventures SAS, sauf mention contraire. Toute reproduction,
            représentation, modification ou exploitation totale ou partielle,
            sans autorisation écrite préalable, est strictement interdite et
            constitue une contrefaçon sanctionnée par les articles L335-2 et
            suivants du Code de la propriété intellectuelle.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-mv-ink mb-4">
            Données personnelles
          </h2>
          <p>
            Les données personnelles recueillies via les formulaires sont
            traitées conformément au Règlement Général sur la Protection des
            Données (RGPD) et à la loi Informatique et Libertés. Pour en
            savoir plus, consultez notre{" "}
            <Link
              href="/politique-confidentialite"
              className="text-mv-ink underline underline-offset-2 hover:text-mv-sand"
            >
              politique de confidentialité
            </Link>
            .
          </p>
        </section>

        <section id="cgv">
          <h2 className="font-display text-2xl font-semibold text-mv-ink mb-4">
            Conditions générales de vente
          </h2>
          <p>
            Les prestations de Moon Ventures SAS sont régies par les conditions
            générales de vente communiquées au client lors de la signature du
            devis. Paiement 50 % à la commande, 50 % à la livraison. TVA
            française 20 % applicable. Pour toute demande de copie&nbsp;:{" "}
            <a
              className="text-mv-ink underline underline-offset-2 hover:text-mv-sand"
              href="mailto:contact@moon-ventures.fr"
            >
              contact@moon-ventures.fr
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
