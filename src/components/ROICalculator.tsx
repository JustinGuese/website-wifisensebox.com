import { useMemo, useState } from 'react';

type FieldType = 'number' | 'currency' | 'percent';

interface Field {
  key: string;
  label: string;
  help?: string;
  type: FieldType;
  min: number;
  max: number;
  step: number;
  default: number;
  suffix?: string;
  prefix?: string;
}

interface UseCase {
  id: string;
  category: string;
  title: string;
  href: string;
  pitch: string;
  fields: Field[];
  /** Returns yearly cost of the problem if unsolved (status quo waste). */
  problemCost: (v: Record<string, number>) => number;
  /** Fraction (0..1) of problemCost that WifiSenseBox eliminates. */
  recoveryRate: (v: Record<string, number>) => number;
  /** Number of WifiSenseBox units the buyer realistically needs. */
  unitsNeeded: (v: Record<string, number>) => number;
  /** Optional headline metric label and value (e.g. "Conversion uplift") */
  headlineMetric?: (v: Record<string, number>) => { label: string; value: string };
}

const HARDWARE_COST = 49;
const SUBSCRIPTION_MONTHLY = 29;

const getUseCases = (isDe: boolean): UseCase[] => [
  {
    id: 'hvac-occupancy',
    category: 'smart-office',
    title: isDe ? 'Heizung & Licht Belegung' : 'HVAC & Lighting Occupancy',
    href: '/smart-office/hvac-occupancy',
    pitch: isDe 
      ? 'Hören Sie auf, leere Besprechungsräume zu heizen, zu kühlen und zu beleuchten. WifiSenseBox weiß, wann ein Raum wirklich belegt ist – selbst wenn Menschen stillsitzen.'
      : 'Stop heating, cooling, and lighting empty meeting rooms. WifiSenseBox knows when a room is truly occupied — even when people sit still.',
    fields: [
      { key: 'rooms', label: isDe ? 'Konferenz- & Besprechungsräume' : 'Conference & meeting rooms', type: 'number', min: 1, max: 500, step: 1, default: 12 },
      { key: 'energyPerRoom', label: isDe ? 'Jährliche Energie-/Lichtkosten pro Raum' : 'Annual HVAC + lighting cost per room', type: 'currency', min: 200, max: 8000, step: 100, default: 2200, prefix: isDe ? '' : '$', suffix: isDe ? ' €' : '' },
      { key: 'vacancy', label: isDe ? 'Durchschnittliche Leerstandsquote' : 'Average vacancy rate', type: 'percent', min: 10, max: 90, step: 5, default: 55, suffix: '%' },
    ],
    problemCost: (v) => v.rooms * v.energyPerRoom * (v.vacancy / 100),
    recoveryRate: () => 0.45,
    unitsNeeded: (v) => Math.max(1, Math.ceil(v.rooms / 3)),
    headlineMetric: (v) => ({
      label: isDe ? 'Verschwendete Energie/Jahr (Status Quo)' : 'Wasted energy/yr (status quo)',
      value: formatCurrency(v.rooms * v.energyPerRoom * (v.vacancy / 100), isDe),
    }),
  },
  {
    id: 'fall-detection',
    category: 'senior-care',
    title: isDe ? 'Sturzerkennung (Seniorenpflege)' : 'Fall Detection (Senior Care)',
    href: '/senior-care/fall-detection',
    pitch: isDe 
      ? 'Ein einziger unerkannter Sturz kostet 20k–40k € durch Notaufnahme + Krankenhausaufenthalt. WifiSenseBox erkennt Stürze in weniger als 3 Sekunden – ohne Wearables.'
      : 'A single undetected "long lie" fall costs $20k–$40k in ER + extended hospitalization. WifiSenseBox catches falls in under 3 seconds — no wearable required.',
    fields: [
      { key: 'seniors', label: isDe ? 'Überwachte Senioren' : 'Seniors monitored', type: 'number', min: 1, max: 5000, step: 1, default: 40 },
      { key: 'fallRate', label: isDe ? 'Stürze pro 100 Senioren/Jahr' : 'Long-lie falls per 100 seniors/yr', type: 'number', min: 1, max: 30, step: 1, default: 8 },
      { key: 'costPerFall', label: isDe ? 'Durchschn. Kosten pro Sturz' : 'Avg. cost per undetected fall', type: 'currency', min: 5000, max: 100000, step: 1000, default: 28000, prefix: isDe ? '' : '$', suffix: isDe ? ' €' : '' },
    ],
    problemCost: (v) => (v.seniors * v.fallRate / 100) * v.costPerFall,
    recoveryRate: () => 0.7,
    unitsNeeded: (v) => Math.max(1, Math.ceil(v.seniors / 2)),
    headlineMetric: (v) => ({
      label: isDe ? 'Erwartete Sturzkosten/Jahr' : 'Expected fall losses/yr',
      value: formatCurrency((v.seniors * v.fallRate / 100) * v.costPerFall, isDe),
    }),
  },
  {
    id: 'true-presence',
    category: 'smart-home',
    title: isDe ? 'Echte Präsenz (Smart Home)' : 'True Presence (Smart Home)',
    href: '/smart-home/true-presence',
    pitch: isDe 
      ? 'PIR-Sensoren lassen Sie im Dunkeln stehen. True Presence lässt das Licht an, während Sie lesen – und schaltet es sofort aus, wenn der Raum wirklich leer ist.'
      : 'PIR sensors leave you in the dark. True presence keeps lights on while you read — and shuts them off the second the room is truly empty.',
    fields: [
      { key: 'rooms', label: isDe ? 'Räume mit Smart Lighting/Heizung' : 'Rooms with smart lighting/HVAC', type: 'number', min: 1, max: 30, step: 1, default: 6 },
      { key: 'utilityBill', label: isDe ? 'Jährliche Stromrechnung' : 'Annual electricity bill', type: 'currency', min: 400, max: 8000, step: 100, default: 2400, prefix: isDe ? '' : '$', suffix: isDe ? ' €' : '' },
      { key: 'wastePct', label: isDe ? 'Energieverschwendung in leeren Räumen' : 'Energy wasted on empty rooms', type: 'percent', min: 5, max: 50, step: 1, default: 22, suffix: '%' },
    ],
    problemCost: (v) => v.utilityBill * (v.wastePct / 100),
    recoveryRate: () => 0.6,
    unitsNeeded: () => 1,
    headlineMetric: (v) => ({
      label: isDe ? 'Ihre jährliche Verschwendung' : 'Energy you waste yearly',
      value: formatCurrency(v.utilityBill * (v.wastePct / 100), isDe),
    }),
  },
  {
    id: 'dwell-heatmap',
    category: 'retail',
    title: isDe ? 'Verweildauer & Heatmaps (Retail)' : 'Dwell & Heatmaps (Retail)',
    href: '/retail/dwell-heatmap',
    pitch: isDe 
      ? 'Besucherströme, Verweildauern und Warteschlangen-Analytics in Kamera-Qualität – mit null DSGVO-Aufwand. 1 % mehr Conversion zahlt das System vielfach zurück.'
      : 'Camera-grade footfall, dwell time, and queue analytics — with zero GDPR paperwork. A +1% conversion lift pays for the system many times over.',
    fields: [
      { key: 'monthlyRevenue', label: isDe ? 'Monatlicher Ladenumsatz' : 'Monthly store revenue', type: 'currency', min: 10000, max: 5000000, step: 5000, default: 180000, prefix: isDe ? '' : '$', suffix: isDe ? ' €' : '' },
      { key: 'uplift', label: isDe ? 'Realistische Conversion-Steigerung' : 'Realistic conversion uplift', type: 'percent', min: 1, max: 15, step: 1, default: 5, suffix: '%' },
      { key: 'stores', label: isDe ? 'Anzahl der Filialen' : 'Number of stores', type: 'number', min: 1, max: 500, step: 1, default: 1 },
    ],
    problemCost: (v) => v.monthlyRevenue * 12 * v.stores * (v.uplift / 100),
    recoveryRate: () => 1,
    unitsNeeded: (v) => Math.max(1, v.stores * 2),
    headlineMetric: (v) => ({
      label: isDe ? 'Freigesetzter Umsatz/Jahr' : 'Revenue unlocked/yr',
      value: formatCurrency(v.monthlyRevenue * 12 * v.stores * (v.uplift / 100), isDe),
    }),
  },
  {
    id: 'cobot-safety-zone',
    category: 'industrial',
    title: isDe ? 'Cobot-Sicherheitszonen (Industrie)' : 'Cobot Safety Zones (Industrial)',
    href: '/industrial/cobot-safety-zone',
    pitch: isDe 
      ? 'Lichtschranken und Laserscanner lösen in staubigen Anlagen ständig Fehlstopps aus. WifiSenseBox sieht durch Staub und Nebel – und hält Ihre Cobots am Laufen.'
      : 'Light curtains and laser scanners trigger constant nuisance stops in dusty plants. WifiSenseBox sees through dust, mist, and oil — keeping cobots running.',
    fields: [
      { key: 'cells', label: isDe ? 'Cobot-Zellen' : 'Cobot cells', type: 'number', min: 1, max: 200, step: 1, default: 6 },
      { key: 'downtimeCost', label: isDe ? 'Produktionsstillstandskosten / Std.' : 'Production downtime cost / hour', type: 'currency', min: 100, max: 20000, step: 100, default: 2400, prefix: isDe ? '' : '$', suffix: isDe ? ' €' : '' },
      { key: 'falseStopHrs', label: isDe ? 'Fehlstopp-Stunden / Zelle / Woche' : 'False-stop hours / cell / week', type: 'number', min: 0.5, max: 40, step: 0.5, default: 4 },
    ],
    problemCost: (v) => v.cells * v.falseStopHrs * 50 * v.downtimeCost,
    recoveryRate: () => 0.8,
    unitsNeeded: (v) => Math.max(1, v.cells),
    headlineMetric: (v) => ({
      label: isDe ? 'Stillstandskosten/Jahr (Status Quo)' : 'Downtime cost/yr (status quo)',
      value: formatCurrency(v.cells * v.falseStopHrs * 50 * v.downtimeCost, isDe),
    }),
  },
];

function formatCurrency(n: number, isDe: boolean): string {
  if (!isFinite(n)) return isDe ? '0 €' : '$0';
  const prefix = isDe ? '' : '$';
  const suffix = isDe ? ' €' : '';
  if (Math.abs(n) >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(2)}M${suffix}`;
  if (Math.abs(n) >= 10_000) return `${prefix}${Math.round(n / 1000)}k${suffix}`;
  return `${prefix}${Math.round(n).toLocaleString(isDe ? 'de-DE' : 'en-US')}${suffix}`;
}

function formatMultiplier(n: number): string {
  if (!isFinite(n) || n <= 0) return '—';
  if (n >= 100) return `${Math.round(n)}×`;
  return `${n.toFixed(1)}×`;
}

export default function ROICalculator({ initialUseCase, locale = 'en' }: { initialUseCase?: string, locale?: 'en' | 'de' }) {
  const isDe = locale === 'de';
  const useCases = useMemo(() => getUseCases(isDe), [isDe]);
  const [selectedId, setSelectedId] = useState<string>(initialUseCase && useCases.find(u => u.id === initialUseCase) ? initialUseCase : useCases[0].id);
  const selected = useCases.find(u => u.id === selectedId)!;

  const [values, setValues] = useState<Record<string, Record<string, number>>>(() => {
    const init: Record<string, Record<string, number>> = {};
    for (const uc of useCases) {
      init[uc.id] = Object.fromEntries(uc.fields.map(f => [f.key, f.default]));
    }
    return init;
  });

  const v = values[selectedId];

  const calc = useMemo(() => {
    const problem = selected.problemCost(v);
    const recovery = selected.recoveryRate(v);
    const annualSavings = problem * recovery;
    const units = selected.unitsNeeded(v);
    const yearOneCost = units * HARDWARE_COST + units * SUBSCRIPTION_MONTHLY * 12;
    const ongoingCost = units * SUBSCRIPTION_MONTHLY * 12;
    const netYearOne = annualSavings - yearOneCost;
    const fiveYearNet = annualSavings * 5 - (units * HARDWARE_COST + ongoingCost * 5);
    const roi = yearOneCost > 0 ? annualSavings / yearOneCost : 0;
    const paybackMonths = annualSavings > 0 ? (yearOneCost / annualSavings) * 12 : Infinity;
    const headline = selected.headlineMetric?.(v);
    return { problem, recovery, annualSavings, units, yearOneCost, ongoingCost, netYearOne, fiveYearNet, roi, paybackMonths, headline };
  }, [selected, v]);

  const updateField = (key: string, value: number) => {
    setValues(prev => ({ ...prev, [selectedId]: { ...prev[selectedId], [key]: value } }));
  };

  const ui = {
    step1: isDe ? 'Schritt 1 · Szenario wählen' : 'Step 1 · Pick your scenario',
    step2: isDe ? 'Schritt 2 · Ihre Zahlen' : 'Step 2 · Your numbers',
    step3: isDe ? 'Schritt 3 · Ihre Ersparnis' : 'Step 3 · Your savings',
    annualSavings: isDe ? 'Jährliche Ersparnis' : 'Annual savings',
    costYr1: isDe ? 'WifiSenseBox Kosten (Jahr 1)' : 'WifiSenseBox cost (yr 1)',
    netYr1: isDe ? 'Netto-Gewinn Jahr 1' : 'Net year-1 gain',
    fiveYearNet: isDe ? '5-Jahres-Gewinn' : '5-year net',
    roi: isDe ? 'Return on Investment' : 'Return on investment',
    payback: isDe ? 'Amortisation' : 'Payback',
    paybackUnit: isDe ? 'Mon.' : 'mo',
    unitLabel: isDe ? 'Einheit' : 'unit',
    unitsLabel: isDe ? 'Einheiten' : 'units',
    cta: isDe ? 'Meinen ROI-Bericht per E-Mail erhalten →' : 'Email me my full ROI report →',
    finePrint: isDe 
      ? 'Wir senden Ihnen ein 1-seitiges PDF mit den Annahmen, dem Pilotangebot und einer Integrationsübersicht.' 
      : "We'll send a 1-page PDF with the assumptions, pilot offer, and integration brief."
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
        <label className="block text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
          {ui.step1}
        </label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId((e.target as HTMLSelectElement).value)}
          className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base font-semibold text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {useCases.map(uc => (
            <option key={uc.id} value={uc.id}>{uc.title}</option>
          ))}
        </select>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">{selected.pitch}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-2 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-100">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">
            {ui.step2}
          </div>
          <div className="space-y-5">
            {selected.fields.map(field => (
              <div key={field.key}>
                <label className="flex items-center justify-between text-sm font-medium text-slate-700 mb-1.5">
                  <span>{field.label}</span>
                  <span className="font-semibold text-slate-900">
                    {field.prefix || ''}{v[field.key].toLocaleString(isDe ? 'de-DE' : 'en-US')}{field.suffix || ''}
                  </span>
                </label>
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={v[field.key]}
                  onChange={(e) => updateField(field.key, Number((e.target as HTMLInputElement).value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>{field.prefix || ''}{field.min.toLocaleString(isDe ? 'de-DE' : 'en-US')}{field.suffix || ''}</span>
                  <span>{field.prefix || ''}{field.max.toLocaleString(isDe ? 'de-DE' : 'en-US')}{field.suffix || ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 p-6 sm:p-8 bg-slate-900 text-white">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-4">
            {ui.step3}
          </div>

          {calc.headline && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-400/20">
              <div className="text-xs uppercase tracking-wider text-rose-300 mb-1">{calc.headline.label}</div>
              <div className="text-2xl font-bold text-rose-200">{calc.headline.value}</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-4 rounded-xl bg-white/5 ring-1 ring-white/10">
              <div className="text-[11px] uppercase tracking-wider text-blue-300 mb-1">{ui.annualSavings}</div>
              <div className="text-2xl font-bold">{formatCurrency(calc.annualSavings, isDe)}</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 ring-1 ring-white/10">
              <div className="text-[11px] uppercase tracking-wider text-blue-300 mb-1">{ui.costYr1}</div>
              <div className="text-2xl font-bold">{formatCurrency(calc.yearOneCost, isDe)}</div>
              <div className="text-[11px] text-slate-400 mt-1">{calc.units} {calc.units > 1 ? ui.unitsLabel : ui.unitLabel} · {isDe ? '' : '$'}{SUBSCRIPTION_MONTHLY}{isDe ? ' €' : ''}/{isDe ? 'Mon.' : 'mo'}</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/30">
              <div className="text-[11px] uppercase tracking-wider text-emerald-300 mb-1">{ui.netYr1}</div>
              <div className="text-2xl font-bold text-emerald-200">{formatCurrency(calc.netYearOne, isDe)}</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/30">
              <div className="text-[11px] uppercase tracking-wider text-emerald-300 mb-1">{ui.fiveYearNet}</div>
              <div className="text-2xl font-bold text-emerald-200">{formatCurrency(calc.fiveYearNet, isDe)}</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 mb-6">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-blue-100 mb-0.5">{ui.roi}</div>
              <div className="text-3xl font-extrabold">{formatMultiplier(calc.roi)}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wider text-blue-100 mb-0.5">{ui.payback}</div>
              <div className="text-3xl font-extrabold">
                {isFinite(calc.paybackMonths) ? `${calc.paybackMonths < 1 ? '<1' : Math.ceil(calc.paybackMonths)} ${ui.paybackUnit}` : '—'}
              </div>
            </div>
          </div>

          <a
            href="#waitlist"
            className="block w-full text-center py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 shadow-lg shadow-blue-900/30 transition-all"
          >
            {ui.cta}
          </a>
          <p className="mt-3 text-center text-xs text-slate-400">
            {ui.finePrint}
          </p>
        </div>
      </div>
    </div>
  );
}
