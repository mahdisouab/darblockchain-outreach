"use client";

import * as React from "react";
import { toast } from "sonner";
import { Calendar, Clock, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";

const timeSlots = (() => {
  const slots: string[] = [];
  for (let h = 12; h <= 13; h++) {
    slots.push(`${String(h).padStart(2, "0")}h00`);
    slots.push(`${String(h).padStart(2, "0")}h30`);
  }
  slots.push("14h00");
  for (let h = 19; h <= 22; h++) {
    slots.push(`${String(h).padStart(2, "0")}h00`);
    slots.push(`${String(h).padStart(2, "0")}h30`);
  }
  return slots;
})();

const todayIso = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

const ReservationSection = () => {
  const [submitting, setSubmitting] = React.useState(false);
  const [formKey, setFormKey] = React.useState(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const phone = (data.get("phone") as string)?.trim();
    if (!name || !email || !phone) {
      toast.error("Merci de renseigner nom, email et téléphone.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success(
        "Votre demande est enregistrée. Nous vous confirmons par email sous 30 minutes."
      );
      setSubmitting(false);
      form.reset();
      setFormKey((k) => k + 1);
    }, 700);
  };

  return (
    <section
      id="reservation"
      className="py-24 bg-bistro-cream scroll-mt-24"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-10 grid gap-12 md:grid-cols-2 items-start">
        <div className="md:pt-6">
          <p className="font-inter text-xs uppercase tracking-[0.3em] text-bistro-terracotta mb-4">
            Réservation
          </p>
          <h2 className="font-fraunces font-semibold text-bistro-charcoal text-4xl md:text-5xl leading-tight">
            Réservez votre table
          </h2>
          <p className="font-inter text-base text-bistro-graphite mt-5 leading-relaxed">
            Service midi de 12h à 14h, soir de 19h à 22h30. Du mardi au samedi.
            Confirmation par email sous 30 minutes.
          </p>

          <ul className="mt-8 space-y-4 font-inter text-sm text-bistro-charcoal">
            <li className="flex items-center gap-3">
              <Calendar size={18} className="text-bistro-forest" />
              Mardi à samedi, midi et soir
            </li>
            <li className="flex items-center gap-3">
              <Clock size={18} className="text-bistro-forest" />
              12h–14h · 19h–22h30
            </li>
            <li className="flex items-center gap-3">
              <Users size={18} className="text-bistro-forest" />
              Groupes de 8+ : nous appeler au 01 43 38 00 00
            </li>
          </ul>
        </div>

        <Card className="shadow-lg">
          <CardContent>
            <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    min={todayIso()}
                    defaultValue={todayIso()}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Heure</Label>
                  <Select id="time" name="time" defaultValue="20h00" required>
                    {timeSlots.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="guests">Couverts</Label>
                <Select id="guests" name="guests" defaultValue="2" required>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "personne" : "personnes"}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Camille Lefèvre"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="06 12 34 56 78"
                    autoComplete="tel"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Demande spéciale (optionnel)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Allergies, anniversaire, table en terrasse..."
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Envoi…" : "Confirmer la réservation"}
              </Button>
              <p className="font-inter text-xs text-bistro-graphite text-center">
                Annulation gratuite jusqu&apos;à 4 heures avant le service.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ReservationSection;
