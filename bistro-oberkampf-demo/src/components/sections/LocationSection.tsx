import { MapPin, Phone, Mail, Train } from "lucide-react";

const LocationSection = () => {
  return (
    <section className="py-24 bg-bistro-cream">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <p className="font-inter text-xs uppercase tracking-[0.3em] text-bistro-terracotta mb-4">
            Nous trouver
          </p>
          <h2 className="font-fraunces font-semibold text-bistro-charcoal text-4xl md:text-5xl">
            À deux pas du métro Parmentier
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-2 items-stretch">
          <div className="rounded-2xl overflow-hidden shadow-lg bg-white aspect-[4/3] md:aspect-auto md:h-[400px]">
            <iframe
              src="https://www.google.com/maps?q=47+rue+Oberkampf+75011+Paris&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Plan d'accès Bistro Oberkampf"
              className="border-0"
            />
          </div>

          <div className="flex flex-col justify-center">
            <ul className="space-y-6">
              <li className="flex gap-4">
                <span className="w-10 h-10 rounded-full bg-bistro-forest/10 text-bistro-forest flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="font-inter text-xs uppercase tracking-wider text-bistro-graphite mb-1">
                    Adresse
                  </p>
                  <p className="font-fraunces text-lg text-bistro-charcoal">
                    47 rue Oberkampf, 75011 Paris
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-10 h-10 rounded-full bg-bistro-forest/10 text-bistro-forest flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </span>
                <div>
                  <p className="font-inter text-xs uppercase tracking-wider text-bistro-graphite mb-1">
                    Téléphone
                  </p>
                  <a
                    href="tel:+33143380000"
                    className="font-fraunces text-lg text-bistro-charcoal hover:text-bistro-forest"
                  >
                    01 43 38 00 00
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-10 h-10 rounded-full bg-bistro-forest/10 text-bistro-forest flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </span>
                <div>
                  <p className="font-inter text-xs uppercase tracking-wider text-bistro-graphite mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:bonjour@bistro-oberkampf.fr"
                    className="font-fraunces text-lg text-bistro-charcoal hover:text-bistro-forest"
                  >
                    bonjour@bistro-oberkampf.fr
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-10 h-10 rounded-full bg-bistro-forest/10 text-bistro-forest flex items-center justify-center shrink-0">
                  <Train size={18} />
                </span>
                <div>
                  <p className="font-inter text-xs uppercase tracking-wider text-bistro-graphite mb-1">
                    Métros
                  </p>
                  <p className="font-fraunces text-base text-bistro-charcoal leading-snug">
                    Parmentier (ligne 3) — 200 m
                    <br />
                    Saint-Ambroise (ligne 9) — 300 m
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-bistro-charcoal/10">
              <p className="font-inter text-xs uppercase tracking-wider text-bistro-graphite mb-2">
                Horaires
              </p>
              <dl className="grid grid-cols-2 gap-y-1 font-inter text-sm text-bistro-charcoal">
                <dt>Lundi</dt>
                <dd className="text-right text-bistro-graphite">Fermé</dd>
                <dt>Mardi à samedi</dt>
                <dd className="text-right">12h–14h · 19h–22h30</dd>
                <dt>Dimanche</dt>
                <dd className="text-right text-bistro-graphite">Fermé</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
