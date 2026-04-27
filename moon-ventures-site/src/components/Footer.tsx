import Link from "next/link";

const NAV = [
  { label: "Approche", href: "/#approche" },
  { label: "Tarifs", href: "/#tarifs" },
  { label: "Démo", href: "/#demo" },
  { label: "Audit gratuit", href: "/#audit" },
];

const LEGAL = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politique-confidentialite" },
  { label: "CGV", href: "/mentions-legales#cgv" },
];

export function Footer() {
  return (
    <footer className="bg-mv-night text-white/80">
      <div className="max-w-6xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="space-y-3">
          <p className="font-display text-2xl font-semibold text-white">
            Moon Ventures
          </p>
          <p className="text-sm leading-relaxed">
            Sites avec agent IA pour PME françaises. Livrés en 7 à 21 jours.
          </p>
          <p className="text-sm leading-relaxed">
            28 Boulevard de la Corderie
            <br />
            13007 Marseille
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-mv-sand mb-4">
            Navigation
          </p>
          <ul className="space-y-2 text-sm">
            {NAV.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-white" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-mv-sand mb-4">
            Légal
          </p>
          <ul className="space-y-2 text-sm">
            {LEGAL.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-white" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-mv-sand mb-4">
            Contact
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                className="hover:text-white"
                href="mailto:contact@moon-ventures.fr"
              >
                contact@moon-ventures.fr
              </a>
            </li>
            <li>
              <a
                className="hover:text-white"
                href="https://cal.com/moon-ventures/audit"
                target="_blank"
                rel="noopener noreferrer"
              >
                cal.com/moon-ventures
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-white/60 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Moon Ventures. Tous droits réservés.</p>
          <p>
            Moon Ventures SAS — Capital 22 222 € — SIRET 101 349 033 00015 — TVA
            FR29101349033
          </p>
        </div>
      </div>
    </footer>
  );
}
