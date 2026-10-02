import React, { useMemo } from 'react';

interface ChartProps {
  blockText: string;
}

interface ParsedChartData {
  type: 'bar' | 'line' | 'scatter';
  title: string;
  points: { label: string; value: number }[];
  xKey?: string;
  yKey?: string;
}

export const InteractiveChartRenderer: React.FC<ChartProps> = ({ blockText }) => {
  const chartData: ParsedChartData | null = useMemo(() => {
    try {
      const lines = blockText.trim().split('\n');
      let type: 'bar' | 'line' | 'scatter' = 'bar';
      let title = 'Analytical Chart';
      let dataText = '';
      let isDataSection = false;

      for (const line of lines) {
        if (line.startsWith('type:')) {
          const t = line.replace('type:', '').trim().toLowerCase();
          if (t === 'line' || t === 'scatter' || t === 'bar') type = t;
        } else if (line.startsWith('title:')) {
          title = line.replace('title:', '').trim();
        } else if (line.startsWith('data:')) {
          isDataSection = true;
          const rest = line.replace('data:', '').trim();
          if (rest) dataText += rest + '\n';
        } else if (isDataSection) {
          dataText += line + '\n';
        }
      }

      dataText = dataText.trim();
      const points: { label: string; value: number }[] = [];

      // Check if data is JSON
      if (dataText.startsWith('[') || dataText.startsWith('{')) {
        const parsed = JSON.parse(dataText);
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of arr) {
          const keys = Object.keys(item);
          const label = String(item.x || item.label || item[keys[0]] || '');
          const val = Number(item.y || item.value || item[keys[1]] || 0);
          if (!isNaN(val)) {
            points.push({ label, value: val });
          }
        }
      } else {
        // Parse CSV
        const csvLines = dataText.split('\n').filter((l) => l.trim().length > 0);
        if (csvLines.length > 1) {
          // Skip header if it exists
          const startIndex = isNaN(Number(csvLines[0].split(',')[1])) ? 1 : 0;
          for (let i = startIndex; i < csvLines.length; i++) {
            const parts = csvLines[i].split(',');
            if (parts.length >= 2) {
              const label = parts[0].trim();
              const value = parseFloat(parts[1].trim());
              if (!isNaN(value)) {
                points.push({ label, value });
              }
            }
          }
        }
      }

      if (points.length === 0) return null;
      return { type, title, points };
    } catch (e) {
      return null;
    }
  }, [blockText]);

  if (!chartData || chartData.points.length === 0) {
    return (
      <div className="my-6 p-4 rounded bg-[#091f16] border border-amber-500/30 text-xs text-amber-200 font-mono">
        [Chart Parser Warning: Unable to parse chart CSV/JSON data. Format: type: bar\ntitle: Chart\ndata:\nx,y\nA,10\nB,20]
      </div>
    );
  }

  const { type, title, points } = chartData;
  const maxValue = Math.max(...points.map((p) => p.value), 1);
  const chartHeight = 220;
  const chartWidth = 540;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  return (
    <figure className="book-figure my-6">
      <div className="book-figure-img-wrap bg-[#06150e] border border-[#d4af37]/30 p-4 rounded-sm flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-3 pb-2 border-b border-[#d4af37]/20">
          <span className="font-serif text-sm font-bold text-[#f5f2ea] tracking-wide">
            {title}
          </span>
          <span className="font-mono text-[10px] text-[#e6c86e] uppercase tracking-wider px-1.5 py-0.5 border border-[#d4af37]/30 rounded">
            Interactive {type} visual
          </span>
        </div>

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full max-w-[560px] h-auto overflow-visible select-none"
        >
          {/* Background grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + innerHeight * (1 - ratio);
            const val = (maxValue * ratio).toLocaleString();
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="rgba(212, 175, 55, 0.15)"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#879287"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bar Chart */}
          {type === 'bar' &&
            points.map((p, idx) => {
              const barWidth = Math.min(innerWidth / points.length - 8, 42);
              const x = padding.left + (idx + 0.5) * (innerWidth / points.length) - barWidth / 2;
              const barHeight = (p.value / maxValue) * innerHeight;
              const y = padding.top + innerHeight - barHeight;

              return (
                <g key={idx} className="group">
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill="#d4af37"
                    opacity="0.85"
                    className="hover:opacity-100 transition-opacity"
                    rx="1"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    fill="#f5f2ea"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {p.value.toLocaleString()}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight - padding.bottom + 16}
                    textAnchor="middle"
                    fill="#c9c3b4"
                    fontSize="9"
                    fontFamily="sans-serif"
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}

          {/* Line Chart */}
          {type === 'line' && (
            <g>
              <polyline
                fill="none"
                stroke="#d4af37"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points
                  .map((p, idx) => {
                    const x = padding.left + (idx + 0.5) * (innerWidth / points.length);
                    const y = padding.top + innerHeight - (p.value / maxValue) * innerHeight;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
              {points.map((p, idx) => {
                const x = padding.left + (idx + 0.5) * (innerWidth / points.length);
                const y = padding.top + innerHeight - (p.value / maxValue) * innerHeight;
                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="4" fill="#071610" stroke="#d4af37" strokeWidth="2" />
                    <text
                      x={x}
                      y={y - 8}
                      textAnchor="middle"
                      fill="#f5f2ea"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {p.value.toLocaleString()}
                    </text>
                    <text
                      x={x}
                      y={chartHeight - padding.bottom + 16}
                      textAnchor="middle"
                      fill="#c9c3b4"
                      fontSize="9"
                      fontFamily="sans-serif"
                    >
                      {p.label}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Scatter Chart */}
          {type === 'scatter' &&
            points.map((p, idx) => {
              const x = padding.left + (idx + 0.5) * (innerWidth / points.length);
              const y = padding.top + innerHeight - (p.value / maxValue) * innerHeight;
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="5" fill="#e6c86e" opacity="0.9" />
                  <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    fill="#f5f2ea"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {p.value.toLocaleString()}
                  </text>
                  <text
                    x={x}
                    y={chartHeight - padding.bottom + 16}
                    textAnchor="middle"
                    fill="#c9c3b4"
                    fontSize="9"
                    fontFamily="sans-serif"
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>
      <figcaption className="book-figcaption">
        <span className="figure-caption-text">Dynamic embedded visual generated from inline studio dataset.</span>
      </figcaption>
    </figure>
  );
};
