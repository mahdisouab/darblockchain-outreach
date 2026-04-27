import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Train } from "lucide-react";
import ContactForm from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Nous contacter",
  description:
    "Contactez le Bistro Oberkampf : adresse, téléphone, email, horaires.",
};

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-bistro-cream">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-16">
            <p className="font-inter text-xs uppercase tracking-[0.3em] text-bistro-terracotta mb-4">
              Contact
            </p>
            <h1 className="font-fraunces font-semibold text-bistro-charcoal text-5xl md:text-6xl leading-tight">
              Nous contacter
            </h1>
            <p className="font-inter text-base text-bistro-graphite mt-5 leading-relaxed">
              Une question, un événement privé, un message pour le chef ?
              Écrivez-nous, nous répondons sous 24 heures ouvrées.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-8">
              <div className="flex gap-4">
                <span className="w-11 h-11 rounded-full bg-bistro-forest/10 text-bistro-forest flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </span>
                <div>
                  <p className="font-inter text-xs uppercase tracking-wider text-bistro-graphite mb-1">
                    Adresse
                  </p>
                  <p className="font-fraunces text-lg text-bistro-charcoal leading-snug">
                    47 rue Oberkampf
                    <br />
                    75011 Paris
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="w-11 h-11 rounded-full bg-bistro-forest/10 text-bistro-forest flex items-center justify-center shrink-0">
                  <Phone size={20} />
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
              </div>

              <div className="flex gap-4">
                <span className="w-11 h-11 rounded-full bg-bistro-forest/10 text-bistro-forest flex items-center justify-center shrink-0">
                  <Mail size={20} />
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
              </div>

              <div className="flex gap-4">
                <span className="w-11 h-11 rounded-full bg-bistro-forest/10 text-bistro-forest flex items-center justify-center shrink-0">
                  <Clock size={20} />
                </span>
                <div>
                  <p className="font-inter text-xs uppercase tracking-wider text-bistro-graphite mb-1">
                    Horaires
                  </p>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 font-inter text-sm text-bistro-charcoal">
                    <dt>Lundi</dt>
                    <dd className="text-bistro-graphite">Fermé</dd>
                    <dt>Mardi à samedi</dt>
                    <dd>12h–14h · 19h–22h30</dd>
                    <dt>Dimanche</dt>
                    <dd className="text-bistro-graphite">Fermé</dd>
                  </dl>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="w-11 h-11 rounded-full bg-bistro-forest/10 text-bistro-forest flex items-center justify-center shrink-0">
                  <Train size={20} />
                </span>
                <div>
                  <p className="font-inter text-xs uppercase tracking-wider text-bistro-graphite mb-1">
                    Accès
                  </p>
                  <p className="font-inter text-sm text-bistro-charcoal leading-relaxed">
                    Parmentier (M3) à 200 m, Saint-Ambroise (M9) à 300 m,
                    bus 96 arrêt Saint-Ambroise.
                  </p>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      <section className="bg-bistro-cream pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="rounded-2xl overflow-hidden shadow-lg bg-white h-[500px]">
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
        </div>
      </section>
    </>
  );
}
