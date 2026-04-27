# Moon Ventures — Landing principale

Landing principale de Moon Ventures, agence de services digitaux pour PME
françaises. Conçue pour convertir le trafic des cold emails, QR codes
terrain, LinkedIn et partenariats en RDV Cal.com en moins de 2 minutes de
lecture.

À déployer sur le domaine **moon-ventures.fr**.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript 5
- Tailwind CSS v4 (tokens via `@theme` dans `globals.css`)
- Radix UI primitives + composants shadcn-style maison
- Framer Motion (animations au scroll)
- Lucide icons
- Sonner (toasts)
- Cal.com embed (`@calcom/embed-react`)

Polices via `next/font`&nbsp;: Fraunces (titres) + Inter (corps).

## Commandes

```bash
pnpm dev       # serveur de développement (http://localhost:3000)
pnpm build     # build de production
pnpm start     # serveur de production après build
pnpm lint      # ESLint
```

## Structure

```
src/
  app/
    layout.tsx                    Layout racine, métadonnées, fonts, header/footer
    page.tsx                      Home (assemble les 7 sections)
    globals.css                   Tokens Tailwind v4 (couleurs MV, fonts)
    mentions-legales/
    politique-confidentialite/
  components/
    Header.tsx
    Footer.tsx
    Section.tsx                   Wrapper container max-w-6xl
    Reveal.tsx                    Wrapper Framer Motion (fade + slide up)
    CalEmbed.tsx                  Embed Cal.com avec fallback iframe
    AuditForm.tsx                 Formulaire alternatif (toast Sonner)
    sections/
      Hero.tsx
      ForWho.tsx
      Process.tsx
      Pricing.tsx
      Demo.tsx
      FAQ.tsx
      AuditCTA.tsx
    ui/                           Primitives shadcn-style (button, input, card…)
  lib/
    utils.ts                      cn() helper (clsx + tailwind-merge)
```

## Déploiement

### GitHub Pages (configuré par défaut)

Le projet est en `output: 'export'`. Le workflow
`.github/workflows/moon-ventures-pages.yml` construit le site et le publie
sur GitHub Pages à chaque push qui touche `moon-ventures-site/**` sur
`main` ou la branche de feature.

Une fois la branche mergée sur `main` :

1. Repo → Settings → Pages → Source = **GitHub Actions**.
2. Le workflow se lance automatiquement (ou via Actions → Run workflow).
3. Configurer le DNS `moon-ventures.fr` :
   - `A` apex → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
     `185.199.111.153`
   - `CNAME` `www` → `<user>.github.io`
4. Le fichier `public/CNAME` (= `moon-ventures.fr`) est embarqué dans le
   build et conserve le domaine custom à chaque déploiement.

### Vercel (alternative)

```bash
vercel             # preview
vercel --prod      # production
```

Configurer ensuite `moon-ventures.fr` dans Vercel Dashboard → Settings →
Domains. Si tu pars sur Vercel, retire `output: 'export'` de
`next.config.ts` pour profiter d'`next/image`, edge cache, etc.

## Charte graphique

| Token        | Hex      | Usage                                    |
| ------------ | -------- | ---------------------------------------- |
| `mv-night`   | #0c1326  | Fond hero et footer                      |
| `mv-ink`     | #0a0a0a  | Texte principal                          |
| `mv-cream`   | #f5f1ea  | Fond chaud sur sections sobres           |
| `mv-sand`    | #d4b483  | Accent doré (CTA, highlights, lune)      |
| `mv-graphite`| #4a4a4a  | Texte secondaire                         |
| `mv-mist`    | #e5e7eb  | Séparateurs, bordures discrètes          |
| `mv-forest`  | #1b5e4a  | Accent secondaire (success, checks)      |
