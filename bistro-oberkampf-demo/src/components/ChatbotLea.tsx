"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { Sheet } from "@/components/ui/Sheet";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type Message = {
  id: string;
  from: "lea" | "user";
  text: string;
  needsFollowUp?: boolean;
};

const cases: { keywords: string[]; response: string }[] = [
  {
    keywords: ["réserv", "table", "place"],
    response:
      "Je vous propose de réserver directement depuis la page d'accueil, section Réserver. Souhaitez-vous que je vous y emmène ?",
  },
  {
    keywords: ["menu", "carte", "plat"],
    response:
      "Notre carte change avec les saisons. Vous pouvez la consulter sur la page Menu. Un plat en particulier vous intrigue ?",
  },
  {
    keywords: ["horair", "ouvert", "ferm"],
    response:
      "Nous sommes ouverts du mardi au samedi, midi (12h-14h) et soir (19h-22h30). Fermé dimanche et lundi.",
  },
  {
    keywords: ["métro", "metro", "transport", "venir"],
    response:
      "Métros Parmentier (ligne 3) à 200 mètres et Saint-Ambroise (ligne 9) à 300 mètres. Bus 96 arrêt Saint-Ambroise.",
  },
  {
    keywords: ["voiture", "parking", "garer"],
    response:
      "Parking Q-Park Oberkampf à 5 minutes à pied. Stationnement payant en surface dans le quartier.",
  },
  {
    keywords: ["allergie", "gluten", "végétarien", "vegetarien", "végan", "vegan", "régime", "regime"],
    response:
      "Notre chef adapte volontiers les plats. Précisez vos allergies à la réservation ou en arrivant.",
  },
  {
    keywords: ["groupe", "anniversaire", "privatis", "événement", "evenement"],
    response:
      "Pour les groupes de plus de 8 personnes ou les privatisations, contactez-nous au 01 43 38 00 00. Nous proposons aussi la salle complète en exclusivité.",
  },
  {
    keywords: ["prix", "budget", "cher", "addition", "tarif"],
    response:
      "Comptez environ 45 € par personne en moyenne, hors boissons. Menu midi à 28 € en semaine.",
  },
];

const FALLBACK =
  "Bonne question. Je transmets directement au restaurant, vous serez recontacté sous 30 minutes.";

const getLeaResponse = (
  input: string
): { text: string; fallback: boolean } => {
  const q = input.toLowerCase().trim();
  if (!q) return { text: FALLBACK, fallback: true };
  for (const c of cases) {
    if (c.keywords.some((k) => q.includes(k))) {
      return { text: c.response, fallback: false };
    }
  }
  return { text: FALLBACK, fallback: true };
};

const TypingDots = () => (
  <div className="flex items-end" aria-label="Léa est en train d'écrire">
    <span className="lea-dot" />
    <span className="lea-dot" />
    <span className="lea-dot" />
  </div>
);

const FollowUpInline = () => {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  if (sent) {
    return (
      <p className="font-inter text-xs text-bistro-forest mt-2">
        ✓ Demande envoyée. Le restaurant vous recontacte sous 30 minutes.
      </p>
    );
  }
  return (
    <form
      className="mt-3 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.trim() || !email.includes("@")) {
          toast.error("Email invalide.");
          return;
        }
        setSent(true);
      }}
    >
      <Input
        type="email"
        placeholder="vous@exemple.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-9 text-xs"
        aria-label="Votre email"
      />
      <button
        type="submit"
        className="h-9 px-3 rounded-lg bg-bistro-forest text-white text-xs font-inter font-medium hover:bg-bistro-charcoal transition whitespace-nowrap"
      >
        Être recontacté
      </button>
    </form>
  );
};

const ChatbotLea = () => {
  const [open, setOpen] = React.useState(false);
  const [hasGreeted, setHasGreeted] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const showBadge = !open && !hasGreeted;

  React.useEffect(() => {
    if (!open || hasGreeted) return;
    let typingTimer: ReturnType<typeof setTimeout> | undefined;
    const startTimer = setTimeout(() => {
      setTyping(true);
      typingTimer = setTimeout(() => {
        setTyping(false);
        setMessages([
          {
            id: "greet",
            from: "lea",
            text:
              "Bonjour, je suis Léa. Je peux vous aider à réserver, vous renseigner sur le menu, ou vous donner les horaires. Que puis-je faire pour vous ?",
          },
        ]);
        setHasGreeted(true);
      }, 1200);
    }, 800);
    return () => {
      clearTimeout(startTimer);
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [open, hasGreeted]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  React.useEffect(() => {
    if (open && hasGreeted) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [open, hasGreeted]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || typing) return;
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      from: "user",
      text,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    const { text: response, fallback } = getLeaResponse(text);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: `l-${Date.now()}`,
          from: "lea",
          text: response,
          needsFollowUp: fallback,
        },
      ]);
    }, 1200);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le chat avec Léa"
        className="fixed bottom-6 right-6 z-50 w-[60px] h-[60px] rounded-full bg-bistro-forest text-white shadow-xl hover:scale-110 transition-transform flex items-center justify-center"
      >
        <MessageCircle size={26} />
        {showBadge && (
          <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 rounded-full bg-bistro-terracotta text-white text-xs font-inter font-semibold flex items-center justify-center shadow-md ring-2 ring-bistro-cream animate-pulse">
            1
          </span>
        )}
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        width="420px"
        ariaLabel="Chat avec Léa"
      >
        <div className="flex flex-col h-full">
          <header className="px-6 pt-6 pb-4 border-b border-bistro-charcoal/10 bg-white">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-bistro-terracotta text-white flex items-center justify-center font-fraunces font-semibold text-lg">
                L
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
              </div>
              <div>
                <p className="font-fraunces font-semibold text-bistro-charcoal text-base">
                  Léa
                </p>
                <p className="font-inter text-xs text-bistro-graphite flex items-center gap-1.5">
                  Assistante du Bistro Oberkampf
                  <span className="text-emerald-600">• En ligne</span>
                </p>
              </div>
            </div>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3 bg-bistro-cream"
          >
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${
                    m.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 font-inter text-sm leading-relaxed ${
                      m.from === "user"
                        ? "bg-bistro-forest text-white rounded-2xl rounded-br-sm"
                        : "bg-white text-bistro-charcoal rounded-2xl rounded-bl-sm border border-bistro-charcoal/5"
                    }`}
                  >
                    {m.text}
                    {m.from === "lea" && m.needsFollowUp && <FollowUpInline />}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-2xl rounded-bl-sm border border-bistro-charcoal/5 px-4 py-3">
                    <TypingDots />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="px-5 py-4 border-t border-bistro-charcoal/10 bg-white">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Écrivez votre message..."
                aria-label="Écrire un message"
                disabled={typing}
              />
              <Button
                onClick={handleSend}
                size="md"
                aria-label="Envoyer"
                className="h-11 w-11 px-0 rounded-full"
                disabled={typing || !input.trim()}
              >
                <Send size={16} />
              </Button>
            </div>
            <p className="font-inter text-[11px] text-bistro-graphite/70 text-center mt-3">
              Propulsé par{" "}
              <a
                href="https://moon-ventures.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-bistro-forest underline-offset-2 hover:underline"
              >
                Moon Ventures IA
              </a>
            </p>
          </div>
        </div>
      </Sheet>
    </>
  );
};

export default ChatbotLea;
