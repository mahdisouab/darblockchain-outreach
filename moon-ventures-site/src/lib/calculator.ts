export interface CalculatorInputs {
  couvertsMois: number;
  ticketMoyen: number;
  pctTheFork: number;
  pctUberDeliveroo: number;
}

export interface CalculatorResult {
  commissionTheForkAnnuelle: number;
  commissionUberDeliverooAnnuelle: number;
  pertesPlateformesAnnuelles: number;
  pertesPlateformesMensuelles: number;
  gainBrutMoonVentures: number;
  coutMoonVenturesAn1: number;
  gainNetMoonVenturesAn1: number;
  roiAn1: number;
  gainNetMoonVenturesAn2: number;
}

export const ASSUMPTIONS = {
  commissionTheFork: 0.15,
  commissionUberDeliveroo: 0.28,
  tauxRecuperation: 0.6,
  setupGrowth: 2490,
  mensualiteGrowth: 149,
} as const;

export const COUT_MOON_VENTURES_AN_1 =
  ASSUMPTIONS.setupGrowth + ASSUMPTIONS.mensualiteGrowth * 12;

export const COUT_MOON_VENTURES_AN_2 = ASSUMPTIONS.mensualiteGrowth * 12;

export const DEFAULT_INPUTS: CalculatorInputs = {
  couvertsMois: 600,
  ticketMoyen: 35,
  pctTheFork: 30,
  pctUberDeliveroo: 20,
};

export const INPUT_RANGES = {
  couvertsMois: { min: 50, max: 3000, step: 50 },
  ticketMoyen: { min: 15, max: 100, step: 1 },
  pctTheFork: { min: 0, max: 80, step: 5 },
  pctUberDeliveroo: { min: 0, max: 80, step: 5 },
} as const;

export function clampInput(
  key: keyof CalculatorInputs,
  value: number
): number {
  const { min, max } = INPUT_RANGES[key];
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function calculate(inputs: CalculatorInputs): CalculatorResult {
  const { couvertsMois, ticketMoyen, pctTheFork, pctUberDeliveroo } = inputs;

  const commissionTheForkAnnuelle =
    couvertsMois *
    (pctTheFork / 100) *
    ticketMoyen *
    ASSUMPTIONS.commissionTheFork *
    12;

  const commissionUberDeliverooAnnuelle =
    couvertsMois *
    (pctUberDeliveroo / 100) *
    ticketMoyen *
    ASSUMPTIONS.commissionUberDeliveroo *
    12;

  const pertesPlateformesAnnuelles =
    commissionTheForkAnnuelle + commissionUberDeliverooAnnuelle;

  const pertesPlateformesMensuelles = pertesPlateformesAnnuelles / 12;

  const gainBrutMoonVentures =
    pertesPlateformesAnnuelles * ASSUMPTIONS.tauxRecuperation;

  const coutMoonVenturesAn1 = COUT_MOON_VENTURES_AN_1;

  const gainNetMoonVenturesAn1 = gainBrutMoonVentures - coutMoonVenturesAn1;

  const roiAn1 =
    coutMoonVenturesAn1 === 0
      ? 0
      : Math.round((gainNetMoonVenturesAn1 / coutMoonVenturesAn1) * 100);

  const gainNetMoonVenturesAn2 = gainBrutMoonVentures - COUT_MOON_VENTURES_AN_2;

  return {
    commissionTheForkAnnuelle,
    commissionUberDeliverooAnnuelle,
    pertesPlateformesAnnuelles,
    pertesPlateformesMensuelles,
    gainBrutMoonVentures,
    coutMoonVenturesAn1,
    gainNetMoonVenturesAn1,
    roiAn1,
    gainNetMoonVenturesAn2,
  };
}

/*
Sanity check (manual) avec DEFAULT_INPUTS = { 600, 35, 30, 20 } :
  commissionTheForkAnnuelle      = 600 × 0.30 × 35 × 0.15 × 12 = 11 340 €
  commissionUberDeliverooAnnuelle = 600 × 0.20 × 35 × 0.28 × 12 = 14 112 €
  pertesPlateformesAnnuelles     = 25 452 €
  gainBrutMoonVentures           = 25 452 × 0.60          ≈ 15 271 €
  coutMoonVenturesAn1            = 2 490 + 149 × 12         = 4 278 €
  gainNetMoonVenturesAn1         ≈ 10 993 €
  roiAn1                         ≈ 257 %
  gainNetMoonVenturesAn2         ≈ 13 483 €

Note T12 : le brief évoquait "pertes ≈ 36 000 €, gain net an 1 ≈ 17 000 €".
Avec la formule explicite, les défauts donnent 25 452 € / 10 993 €. Pour
retomber sur 36 000 € il faut soit augmenter les couverts (~870/mois), soit
forcer une part plateformes plus élevée. La formule reste celle du brief.
*/
