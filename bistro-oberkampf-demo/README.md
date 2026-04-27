# Bistro Oberkampf — démo Moon Ventures

Démo commerciale pour pitch agence/restaurateur. **Bistro Oberkampf n'est pas un vrai restaurant** : tous les contenus, avis, plats et coordonnées sont fictifs.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript
- Tailwind CSS 4
- Framer Motion, lucide-react, sonner
- Polices Fraunces + Inter via `next/font/google`

## Commandes

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
pnpm start
pnpm lint
```

## Structure

```
src/
  app/
    layout.tsx          # Header, Footer, ChatbotLea, Toaster
    page.tsx            # Accueil (Hero + 5 sections)
    menu/page.tsx       # Carte complète
    contact/page.tsx    # Formulaire + carte
    globals.css         # Tokens Tailwind 4 (@theme)
  components/
    Header.tsx, Footer.tsx, ChatbotLea.tsx
    sections/           # Hero, Story, Menu, Reservation, Reviews, Location, ContactForm
    ui/                 # Button, Input, Card, Sheet
  lib/
    menu-data.ts
```

## Notes

Site réalisé par [Moon Ventures](https://moon-ventures.fr) à des fins de démonstration.
