import { useState, useEffect, useMemo } from 'react';

export interface SensingDemoConfig {
  headerLabel?: string;       // e.g. "LIVE HVAC FEED"
  metricLabel?: string;       // e.g. "Respiratory Waveform (CSI)"
  metricUnit?: string;        // e.g. "BPM"
  metricBase?: number;        // baseline value used to seed the value display
  metricMin?: number;
  metricMax?: number;
  metricFooter?: string;      // small italic caption under the chart
  statusLabel?: string;       // e.g. "Presence Status"
  statusOn?: string;          // e.g. "OCCUPIED"
  statusOff?: string;         // e.g. "VACANT"
  secondaryLabel?: string;    // e.g. "Movement Index"
  privacyLabel?: string;
  privacyText?: string;
  ctaText?: string;
}

interface Props {
  config?: SensingDemoConfig;
  locale?: 'en' | 'de';
}

const getDefaults = (isDe: boolean): Required<SensingDemoConfig> => ({
  headerLabel: isDe ? 'Live-Sensor-Feed' : 'Live Sensing Feed',
  metricLabel: isDe ? 'Atmungs-Wellenform (CSI)' : 'Respiratory Waveform (CSI)',
  metricUnit: 'BPM',
  metricBase: 14,
  metricMin: 10,
  metricMax: 25,
  metricFooter: isDe 
    ? 'Erkennung von Mikrobewegungen des Brustkorbs durch eine 12 cm dicke Betonwand.' 
    : 'Detecting micro-movements of chest through 12cm concrete wall.',
  statusLabel: isDe ? 'Anwesenheitsstatus' : 'Presence Status',
  statusOn: isDe ? 'BELEGT' : 'OCCUPIED',
  statusOff: isDe ? 'FREI' : 'VACANT',
  secondaryLabel: isDe ? 'Bewegungsindex' : 'Movement Index',
  privacyLabel: isDe ? 'Datenschutzgarantie' : 'Privacy Guarantee',
  privacyText: isDe 
    ? 'Kosteneffiziente Standalone-Hardware. 100 % DSGVO-konform. Keine Bilder erfasst.' 
    : 'Standalone affordable hardware. 100% GDPR compliant. No images captured.',
  ctaText: isDe ? 'Mesh-Netzwerk konfigurieren' : 'Configure Your Mesh Network',
});

export default function SensingDemo({ config, locale = 'en' }: Props) {
  const isDe = locale === 'de';
  const defaults = useMemo(() => getDefaults(isDe), [isDe]);
  const c = { ...defaults, ...(config || {}) };

  const [active, setActive] = useState(true);
  const [value, setValue] = useState(c.metricBase);
  const [history, setHistory] = useState<number[]>(new Array(40).fill(0));
  const [bars, setBars] = useState<number[]>([0.2, 0.4, 0.8, 0.5, 0.3, 0.6, 0.9, 0.4]);

  // Simulate live status + metric value drift
  useEffect(() => {
    const interval = setInterval(() => {
      setActive(Math.random() > 0.1);
      setValue(prev => {
        const delta = (Math.random() - 0.5) * (c.metricMax - c.metricMin) * 0.04;
        return Math.max(c.metricMin, Math.min(c.metricMax, prev + delta));
      });
      setBars(prev => {
        const next = [...prev.slice(1), 0.2 + Math.random() * 0.7];
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [c.metricMin, c.metricMax]);

  // Animate the waveform — frequency follows the metric value
  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prev => {
        const next = [...prev.slice(1)];
        const time = Date.now() / 1000;
        const freq = Math.max(0.05, value / 60);
        const wave = Math.sin(time * freq * 2 * Math.PI);
        next.push(wave * 0.5 + 0.5 + (Math.random() - 0.5) * 0.05);
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [value]);

  const pathData = useMemo(() => {
    return history.map((val, i) => `${(i / (history.length - 1)) * 100},${100 - val * 80 - 10}`).join(' L ');
  }, [history]);

  return (
    <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 font-sans">
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{c.headerLabel}</span>
        </div>
        <div className="text-[10px] font-mono text-slate-500">{isDe ? 'AES-256 VERSCHLÜSSELT | DSGVO-KONFORM' : 'AES-256 ENCRYPTED | GDPR COMPLIANT'}</div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-400">{c.metricLabel}</h4>
            <div className="text-xl font-mono font-bold text-blue-400">
              {value.toFixed(1)} <span className="text-xs text-slate-500 uppercase">{c.metricUnit}</span>
            </div>
          </div>
          <div className="h-32 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d={`M ${pathData}`} fill="none" stroke="url(#sb-gradient)" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="sb-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="mt-2 text-[10px] text-slate-500 italic">{c.metricFooter}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">{c.statusLabel}</h4>
            <div className={`text-lg font-bold ${active ? 'text-white' : 'text-slate-600'}`}>
              {active ? c.statusOn : c.statusOff}
            </div>
            <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-1000"
                style={{ width: active ? `${70 + Math.random() * 30}%` : '0%' }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">{c.secondaryLabel}</h4>
            <div className="flex items-end gap-2 h-6">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-grow bg-slate-700 rounded-t-sm transition-all duration-500"
                  style={{ height: `${h * 24}px`, opacity: i === bars.length - 1 ? 1 : 0.4 }}
                ></div>
              ))}
            </div>
          </div>

          <div className="bg-blue-600/10 rounded-xl p-4 border border-blue-500/20">
            <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">{c.privacyLabel}</div>
            <p className="text-[11px] text-blue-200/70 leading-relaxed">{c.privacyText}</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex justify-center">
        <a href="#waitlist" className="text-xs font-bold text-white bg-blue-600 px-6 py-2 rounded-full hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">
          {c.ctaText}
        </a>
      </div>
    </div>
  );
}
