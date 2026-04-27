import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité Moon Ventures, conforme RGPD.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-24 md:py-32">
      <header className="mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-mv-sand">
          RGPD
        </p>
        <h1 className="mt-4 font-display font-semibold text-mv-ink text-4xl md:text-5xl leading-tight">
          Politique de confidentialité
        </h1>
        <p className="mt-4 text-sm text-mv-graphite">
          Dernière mise à jour&nbsp;: avril 2026.
        </p>
      </header>

      <div className="space-y-12 text-mv-graphite leading-relaxed">
        <section>
          <h2 className="font-display text-2xl font-semibold text-mv-ink mb-4">
            Responsable du traitement
          </h2>
          <p>
            Moon Ventures SAS, 28 Boulevard de la Corderie, 13007 Marseille.
            SIRET 101 349 033 00015. Pour toute question relative à vos
            données, écrivez à{" "}
            <a
              className="text-mv-ink underline underline-offset-2 hover:text-mv-sand"
              href="mailto:contact@moon-ventures.fr"
            >
              contact@moon-ventures.fr
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-mv-ink mb-4">
            Données collectées
          </h2>
          <p>
            Nous collectons exclusivement les données que vous nous transmettez
            via nos formulaires de contact ou via Cal.com&nbsp;: nom, adresse
            email, numéro de téléphone le cas échéant, URL de votre site
            actuel, nom de votre établissement, secteur d&rsquo;activité.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-mv-ink mb-4">
            Base légale
          </h2>
          <p>
            Le traitement repose sur l&rsquo;intérêt légitime de prospection
            B2B (article 6.1.f du RGPD) et sur votre consentement explicite
            lorsque vous remplissez un formulaire ou prenez rendez-vous.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-mv-ink mb-4">
            Finalités
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Réponse à vos demandes et envoi de l&rsquo;audit gratuit.</li>
            <li>Suivi commercial et relation client.</li>
            <li>Amélioration continue de nos services.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-mv-ink mb-4">
            Durée de conservation
          </h2>
          <p>
            Vos données sont conservées 3 ans à compter du dernier contact
            actif. Au-delà, elles sont archivées ou supprimées conformément aux
            obligations légales.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-mv-ink mb-4">
            Vos droits
          </h2>
          <p>
            Conformément au RGPD, vous disposez d&rsquo;un droit d&rsquo;accès,
            de rectification, d&rsquo;opposition, de suppression, de
            portabilité et de limitation du traitement de vos données. Pour
            exercer ces droits, contactez{" "}
            <a
              className="text-mv-ink underline underline-offset-2 hover:text-mv-sand"
              href="mailto:contact@moon-ventures.fr"
            >
              contact@moon-ventures.fr
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-mv-ink mb-4">
            Autorité de contrôle
          </h2>
          <p>
            En cas de litige non résolu, vous pouvez introduire une réclamation
            auprès de la CNIL (Commission Nationale de l&rsquo;Informatique et
            des Libertés), 3 Place de Fontenoy, 75007 Paris,{" "}
            <a
              className="text-mv-ink underline underline-offset-2 hover:text-mv-sand"
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
            >
              cnil.fr
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
