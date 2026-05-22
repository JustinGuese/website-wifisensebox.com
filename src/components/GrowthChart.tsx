import React from 'react';

type Props = {
  title?: string;
  subtitle?: string;
  badge?: string;
  unitsLabel?: string;
  arrLabel?: string;
  footer1?: string;
  footer2?: string;
};

const data = [
  { year: 2025, units: 500, arr: 60_000 },
  { year: 2026, units: 5_000, arr: 750_000 },
  { year: 2027, units: 25_000, arr: 4_500_000 },
  { year: 2028, units: 150_000, arr: 27_000_000 },
  { year: 2029, units: 1_000_000, arr: 90_000_000 },
  { year: 2030, units: 10_000_000, arr: 250_000_000 },
];

const formatUnits = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return `${n}`;
};

const formatArr = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
};

const GrowthChart: React.FC<Props> = ({
  title = 'Projected Active Units & ARR',
  subtitle = 'Targeting 10M units / $250M ARR by 2030',
  badge = '+200% YoY CAGR',
  unitsLabel = 'Active Units',
  arrLabel = 'ARR (USD)',
  footer1 = 'STRATEGIC FOCUS: EUROPE & NORTH AMERICA',
  footer2 = 'RECURRING REVENUE RATIO: 85%',
}) => {
  const width = 800;
  const height = 400;
  const padding = { top: 30, right: 40, bottom: 50, left: 60 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  // Log scale across both series so the J-curve is visible.
  const allValues = data.flatMap(d => [d.units, d.arr]);
  const minLog = Math.log10(Math.min(...allValues));
  const maxLog = Math.log10(Math.max(...allValues));

  const xScale = (i: number) => padding.left + (i * innerW) / (data.length - 1);
  const yScale = (v: number) =>
    padding.top + innerH - ((Math.log10(v) - minLog) / (maxLog - minLog)) * innerH;

  const unitsPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.units)}`).join(' ');
  const arrPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.arr)}`).join(' ');

  // Log-spaced gridlines: 1k, 10k, 100k, 1M, 10M, 100M
  const grid = [1_000, 10_000, 100_000, 1_000_000, 10_000_000, 100_000_000].filter(
    v => Math.log10(v) >= minLog && Math.log10(v) <= maxLog
  );

  return (
    <div className="w-full bg-slate-900 rounded-2xl p-6 shadow-2xl overflow-hidden border border-slate-800">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <h3 className="text-white font-bold text-xl">{title}</h3>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>
        <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
          {badge}
        </div>
      </div>

      <div className="flex gap-6 mb-4 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-block w-4 h-1 rounded-full bg-blue-500" /> {unitsLabel}
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-block w-4 h-1 rounded-full bg-purple-500" /> {arrLabel}
        </div>
        <div className="ml-auto text-slate-500 font-mono uppercase">log scale</div>
      </div>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {grid.map((v) => (
            <g key={v}>
              <line
                x1={padding.left}
                y1={yScale(v)}
                x2={width - padding.right}
                y2={yScale(v)}
                stroke="#1e293b"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={yScale(v) + 4}
                textAnchor="end"
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
              >
                {formatUnits(v)}
              </text>
            </g>
          ))}

          <path
            d={`${unitsPath} L ${xScale(data.length - 1)} ${padding.top + innerH} L ${padding.left} ${padding.top + innerH} Z`}
            fill="url(#unitsArea)"
            opacity="0.25"
          />

          <path d={arrPath} fill="none" stroke="#a78bfa" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" />
          <path d={unitsPath} fill="none" stroke="url(#unitsLine)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

          {data.map((d, i) => (
            <g key={i}>
              <circle cx={xScale(i)} cy={yScale(d.arr)} r="4" fill="#a78bfa" />
              <circle cx={xScale(i)} cy={yScale(d.units)} r="5" fill="#3b82f6" stroke="#0f172a" strokeWidth="2" />
              <text x={xScale(i)} y={yScale(d.units) - 12} textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">
                {formatUnits(d.units)}
              </text>
              <text x={xScale(i)} y={yScale(d.arr) + 16} textAnchor="middle" fill="#c4b5fd" fontSize="10">
                {formatArr(d.arr)}
              </text>
              <text x={xScale(i)} y={padding.top + innerH + 20} textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="500">
                {d.year}
              </text>
            </g>
          ))}

          <defs>
            <linearGradient id="unitsLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="unitsArea" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="mt-6 flex justify-between text-xs text-slate-500 font-mono flex-wrap gap-2">
        <span>{footer1}</span>
        <span>{footer2}</span>
      </div>
    </div>
  );
};

export default GrowthChart;
