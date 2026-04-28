"use client";

import * as React from "react";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  ASSUMPTIONS,
  DEFAULT_INPUTS,
  INPUT_RANGES,
  calculate,
  type CalculatorInputs,
} from "@/lib/calculator";
import { cn } from "@/lib/utils";

const eurosFmt = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const numberFmt = new Intl.NumberFormat("fr-FR");

function formatEuros(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return eurosFmt.format(Math.round(n));
}

interface AnimatedNumberProps {
  value: number;
  format: (n: number) => string;
  className?: string;
}

function AnimatedNumber({ value, format, className }: AnimatedNumberProps) {
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(value);
  const [display, setDisplay] = React.useState(value);

  useMotionValueEvent(motionValue, "change", (latest) => {
    setDisplay(latest);
  });

  React.useEffect(() => {
    if (motionValue.get() === value) return;
    if (reduced) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration: 0.6,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [value, motionValue, reduced]);

  return <span className={className}>{format(display)}</span>;
}

interface SliderRowProps {
  label: string;
  valueDisplay: string;
  ariaLabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  helper: string;
}

function SliderRow({
  label,
  valueDisplay,
  ariaLabel,
  value,
  min,
  max,
  step,
  onChange,
  helper,
}: SliderRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-medium text-mv-ink text-[15px]">{label}</span>
        <span className="font-display font-semibold text-mv-night text-lg tabular-nums">
          {valueDisplay}
        </span>
      </div>
      <input
        type="range"
        aria-label={ariaLabel}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "w-full appearance-none cursor-pointer bg-transparent",
          "[&::-webkit-slider-runnable-track]:h-1.5",
          "[&::-webkit-slider-runnable-track]:rounded-full",
          "[&::-webkit-slider-runnable-track]:bg-mv-mist",
          "[&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:w-7",
          "[&::-webkit-slider-thumb]:h-7",
          "[&::-webkit-slider-thumb]:-mt-[10px]",
          "[&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:bg-mv-sand",
          "[&::-webkit-slider-thumb]:border-2",
          "[&::-webkit-slider-thumb]:border-white",
          "[&::-webkit-slider-thumb]:shadow-md",
          "[&::-moz-range-track]:h-1.5",
          "[&::-moz-range-track]:rounded-full",
          "[&::-moz-range-track]:bg-mv-mist",
          "[&::-moz-range-thumb]:w-7",
          "[&::-moz-range-thumb]:h-7",
          "[&::-moz-range-thumb]:rounded-full",
          "[&::-moz-range-thumb]:bg-mv-sand",
          "[&::-moz-range-thumb]:border-2",
          "[&::-moz-range-thumb]:border-white",
          "[&::-moz-range-thumb]:shadow",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-sand focus-visible:ring-offset-2 rounded-full"
        )}
      />
      <p className="text-xs text-mv-graphite leading-relaxed">{helper}</p>
    </div>
  );
}

interface CalculateurPlateformesProps {
  variant?: "landing" | "standalone";
}

export function CalculateurPlateformes({
  variant = "landing",
}: CalculateurPlateformesProps) {
  const [couverts, setCouverts] = React.useState(DEFAULT_INPUTS.couvertsMois);
  const [ticket, setTicket] = React.useState(DEFAULT_INPUTS.ticketMoyen);
  const [pctThefork, setPctThefork] = React.useState(DEFAULT_INPUTS.pctTheFork);
  const [pctUber, setPctUber] = React.useState(
    DEFAULT_INPUTS.pctUberDeliveroo
  );
  const [showHypotheses, setShowHypotheses] = React.useState(false);

  const result = React.useMemo(() => {
    const inputs: CalculatorInputs = {
      couvertsMois: couverts,
      ticketMoyen: ticket,
      pctTheFork: pctThefork,
      pctUberDeliveroo: pctUber,
    };
    return calculate(inputs);
  }, [couverts, ticket, pctThefork, pctUber]);

  const ctaProps =
    variant === "landing"
      ? { href: "#audit" as const, asLink: false }
      : { href: "/#audit" as const, asLink: true };

  const negativeGain = result.gainNetMoonVenturesAn1 <= 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-10">
      {/* INPUTS */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-mv-mist">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-mv-sand">
          Calcul personnalisé
        </p>
        <h3 className="mt-3 font-display font-semibold text-mv-ink text-2xl">
          Vos paramètres
        </h3>

        <div className="mt-8 space-y-7">
          <SliderRow
            label="Couverts par mois"
            valueDisplay={`${numberFmt.format(couverts)} couverts`}
            ariaLabel="Couverts par mois"
            value={couverts}
            min={INPUT_RANGES.couvertsMois.min}
            max={INPUT_RANGES.couvertsMois.max}
            step={INPUT_RANGES.couvertsMois.step}
            onChange={setCouverts}
            helper="Estimation, ne compte que les couverts servis sur place et en livraison."
          />

          <SliderRow
            label="Ticket moyen"
            valueDisplay={`${numberFmt.format(ticket)} €`}
            ariaLabel="Ticket moyen en euros"
            value={ticket}
            min={INPUT_RANGES.ticketMoyen.min}
            max={INPUT_RANGES.ticketMoyen.max}
            step={INPUT_RANGES.ticketMoyen.step}
            onChange={setTicket}
            helper="Moyen sur l'ensemble des couverts, boissons incluses."
          />

          <SliderRow
            label="Part de couverts via TheFork"
            valueDisplay={`${pctThefork} %`}
            ariaLabel="Part de couverts via TheFork en pourcentage"
            value={pctThefork}
            min={INPUT_RANGES.pctTheFork.min}
            max={INPUT_RANGES.pctTheFork.max}
            step={INPUT_RANGES.pctTheFork.step}
            onChange={setPctThefork}
            helper="Réservations effectuées via TheFork, chaque couvert payant la commission."
          />

          <SliderRow
            label="Part de couverts via UberEats / Deliveroo"
            valueDisplay={`${pctUber} %`}
            ariaLabel="Part de couverts via UberEats ou Deliveroo en pourcentage"
            value={pctUber}
            min={INPUT_RANGES.pctUberDeliveroo.min}
            max={INPUT_RANGES.pctUberDeliveroo.max}
            step={INPUT_RANGES.pctUberDeliveroo.step}
            onChange={setPctUber}
            helper="Livraisons facturées par les plateformes, commission moyenne 28 %."
          />
        </div>

        <div className="mt-8 border-t border-mv-mist pt-5">
          <button
            type="button"
            onClick={() => setShowHypotheses((v) => !v)}
            aria-expanded={showHypotheses}
            className="flex items-center gap-1 text-sm text-mv-graphite hover:text-mv-ink transition-colors"
          >
            <span>Comment on calcule</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                showHypotheses && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence initial={false}>
            {showHypotheses && (
              <motion.div
                key="hypotheses"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-2 text-[13px] text-mv-graphite leading-relaxed">
                  <p>
                    Commission TheFork retenue&nbsp;: 15 % du ticket par
                    couvert réservé via la plateforme.
                  </p>
                  <p>
                    Commission UberEats / Deliveroo combinée&nbsp;: 28 % du
                    ticket en moyenne.
                  </p>
                  <p>
                    Taux de récupération en direct via un site Moon
                    Ventures&nbsp;: environ 60 %. Estimation conservatrice. Les
                    estimations agences situent ce taux entre 60 et 80 % la
                    première année.
                  </p>
                  <p>
                    Coût Moon Ventures pack Growth&nbsp;: 2 490 € HT de setup,
                    149 € HT par mois ensuite. Année 1 = 4 278 € HT.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* OUTPUTS */}
      <div className="bg-mv-night text-white p-6 md:p-8 rounded-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-mv-sand">
          Résultat
        </p>

        <div className="mt-6" aria-live="polite">
          <p className="text-sm text-white/70">Pertes annuelles plateformes</p>
          <AnimatedNumber
            value={result.pertesPlateformesAnnuelles}
            format={formatEuros}
            className="mt-2 block font-display font-bold italic text-mv-sand text-5xl md:text-6xl leading-none tabular-nums"
          />
          <p className="mt-3 text-[13px] text-white/60">
            Soit{" "}
            <AnimatedNumber
              value={result.pertesPlateformesMensuelles}
              format={formatEuros}
              className="tabular-nums"
            />{" "}
            par mois en commissions versées à TheFork, UberEats et Deliveroo.
          </p>
        </div>

        <hr className="my-7 border-white/15" />

        <div className="space-y-3 text-sm text-white/80" aria-live="polite">
          <div className="flex justify-between gap-4">
            <span>TheFork (15 % de commission)</span>
            <AnimatedNumber
              value={result.commissionTheForkAnnuelle}
              format={formatEuros}
              className="tabular-nums text-white"
            />
          </div>
          <div className="flex justify-between gap-4">
            <span>UberEats / Deliveroo (28 % moyenne)</span>
            <AnimatedNumber
              value={result.commissionUberDeliverooAnnuelle}
              format={formatEuros}
              className="tabular-nums text-white"
            />
          </div>
        </div>

        <hr className="my-7 border-white/15" />

        <div aria-live="polite">
          <p className="text-[13px] italic text-mv-sand">
            Avec un site Moon Ventures, environ 60 % de ces clients reviennent
            en direct.
          </p>

          {negativeGain ? (
            <div className="mt-4">
              <p className="font-display font-bold text-white text-3xl md:text-4xl">
                n/d
              </p>
              <p className="mt-2 text-sm text-white/80">
                Le calcul recommande d&rsquo;attendre une activité plus élevée
                avant de viser un retour positif sur l&rsquo;année 1.
              </p>
            </div>
          ) : (
            <>
              <p className="mt-4 text-sm text-white/70">
                Gain net première année
              </p>
              <AnimatedNumber
                value={result.gainNetMoonVenturesAn1}
                format={formatEuros}
                className="mt-2 block font-display font-bold text-mv-sand text-4xl md:text-5xl leading-none tabular-nums"
              />
              <p className="mt-3 text-[13px] text-white/60">
                Soit un retour sur investissement de{" "}
                <span className="tabular-nums text-white/80">
                  {numberFmt.format(result.roiAn1)} %
                </span>{" "}
                la première année.
              </p>
              <p className="mt-2 text-[12px] text-white/50">
                Année 2 et au-delà, gain net annuel&nbsp;:{" "}
                <AnimatedNumber
                  value={result.gainNetMoonVenturesAn2}
                  format={formatEuros}
                  className="tabular-nums"
                />{" "}
                (sans setup).
              </p>
            </>
          )}
        </div>

        <div className="mt-8">
          {ctaProps.asLink ? (
            <Link
              href={ctaProps.href}
              className="block w-full text-center bg-mv-sand text-mv-ink font-medium px-6 py-4 rounded-full transition-colors hover:bg-white"
            >
              Recevoir mon audit personnalisé
            </Link>
          ) : (
            <a
              href={ctaProps.href}
              className="block w-full text-center bg-mv-sand text-mv-ink font-medium px-6 py-4 rounded-full transition-colors hover:bg-white"
            >
              Recevoir mon audit personnalisé
            </a>
          )}
          <p className="mt-3 text-[12px] italic text-white/50 text-center">
            Ce calcul est une estimation. L&rsquo;audit Moon Ventures vous
            livre les chiffres réels sous 24 heures.
          </p>
        </div>
      </div>
    </div>
  );
}

CalculateurPlateformes.displayName = "CalculateurPlateformes";

// Hypothèses publiques pour réutilisation par d'autres composants.
export { ASSUMPTIONS };
