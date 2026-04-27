import Link from "next/link";

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.2H8.2v3h2.4V21h2.9z" />
  </svg>
);

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-bistro-charcoal text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <span className="font-fraunces italic font-semibold text-xl">
            Bistro Oberkampf
          </span>
          <p className="font-inter text-sm text-white/70 mt-3 leading-relaxed">
            Cuisine de saison, à deux pas d&apos;Oberkampf.
            <br />
            Bistrot parisien depuis 2019.
          </p>
        </div>

        <div>
          <h4 className="font-inter text-xs uppercase tracking-widest text-white/50 mb-4">
            Coordonnées
          </h4>
          <ul className="space-y-2 font-inter text-sm text-white/85">
            <li>47 rue Oberkampf, 75011 Paris</li>
            <li>
              <a href="tel:+33143380000" className="hover:text-white">
                01 43 38 00 00
              </a>
            </li>
            <li>
              <a
                href="mailto:bonjour@bistro-oberkampf.fr"
                className="hover:text-white"
              >
                bonjour@bistro-oberkampf.fr
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-inter text-xs uppercase tracking-widest text-white/50 mb-4">
            Suivez-nous
          </h4>
          <div className="flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-bistro-charcoal transition"
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-bistro-charcoal transition"
            >
              <FacebookIcon size={18} />
            </a>
          </div>
          <ul className="mt-6 space-y-2 font-inter text-sm text-white/70">
            <li>
              <Link href="/menu" className="hover:text-white">
                La carte
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Nous contacter
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <p className="font-inter text-xs text-white/50">
            © {year} Bistro Oberkampf. Tous droits réservés. — Mentions légales · Confidentialité
          </p>
          <p className="font-inter text-xs text-white/35">
            Site réalisé par{" "}
            <a
              href="https://moon-ventures.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 underline-offset-2 hover:underline"
            >
              Moon Ventures
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
