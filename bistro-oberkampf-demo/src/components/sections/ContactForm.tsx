"use client";

import * as React from "react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";

const subjects = [
  "Question sur le menu",
  "Demande de privatisation",
  "Allergies & régimes spéciaux",
  "Presse / partenariat",
  "Autre",
];

const ContactForm = () => {
  const [submitting, setSubmitting] = React.useState(false);
  const [formKey, setFormKey] = React.useState(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const message = (data.get("message") as string)?.trim();
    if (!name || !email || !message) {
      toast.error("Merci de remplir tous les champs requis.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Merci. Nous vous répondons sous 24 heures ouvrées.");
      setSubmitting(false);
      form.reset();
      setFormKey((k) => k + 1);
    }, 700);
  };

  return (
    <Card className="shadow-lg">
      <CardContent>
        <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="contact-name">Nom</Label>
            <Input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Camille Lefèvre"
              autoComplete="name"
              required
            />
          </div>
          <div>
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              placeholder="vous@exemple.com"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <Label htmlFor="contact-subject">Sujet</Label>
            <Select id="contact-subject" name="subject" defaultValue={subjects[0]}>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              name="message"
              placeholder="Bonjour, …"
              className="min-h-[140px]"
              required
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Envoi…" : "Envoyer le message"}
          </Button>
          <p className="font-inter text-xs text-bistro-graphite text-center">
            En soumettant, vous acceptez d&apos;être recontacté par email.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
