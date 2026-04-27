"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SECTORS = [
  { value: "", label: "Sélectionnez un secteur" },
  { value: "restauration", label: "Restauration" },
  { value: "sante", label: "Santé / cabinet" },
  { value: "artisan", label: "Artisan / services" },
  { value: "ecommerce", label: "E-commerce / PME" },
  { value: "autre", label: "Autre" },
];

export function AuditForm() {
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    setTimeout(() => {
      toast.success(
        "Votre audit sera envoyé sous 24 heures à l'adresse indiquée."
      );
      form.reset();
      setSubmitting(false);
    }, 600);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-mv-mist bg-white p-6 md:p-8 shadow-sm space-y-5"
    >
      <div>
        <p className="font-display font-semibold text-mv-ink text-xl">
          Pas envie de bookez tout de suite&nbsp;?
        </p>
        <p className="text-sm text-mv-graphite mt-1">
          Laissez-nous vos coordonnées, nous envoyons l&rsquo;audit en moins de
          24 heures.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" required placeholder="Jean Dupont" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="vous@exemple.fr"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="url">URL du site actuel</Label>
        <Input
          id="url"
          name="url"
          type="url"
          required
          placeholder="https://mon-site.fr"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="gbusiness">Nom Google Business</Label>
        <Input
          id="gbusiness"
          name="gbusiness"
          required
          placeholder="Bistro Oberkampf"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sector">Secteur</Label>
        <select
          id="sector"
          name="sector"
          required
          defaultValue=""
          className="flex h-11 w-full rounded-md border border-mv-mist bg-white px-3 py-2 text-sm text-mv-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-sand"
        >
          {SECTORS.map((s) => (
            <option key={s.value} value={s.value} disabled={s.value === ""}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        variant="default"
        className="w-full"
        disabled={submitting}
      >
        {submitting ? "Envoi en cours..." : "Recevoir mon audit"}
      </Button>
    </form>
  );
}
