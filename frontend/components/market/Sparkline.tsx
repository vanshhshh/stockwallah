export function Sparkline({ values, baseline, positive }: { values: number[]; baseline?: number; positive: boolean }) {
  if (values.length < 2) return <div className="h-12" />;

  const width = 200;
  const height = 48;
  const all = baseline != null ? [...values, baseline] : values;
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = max - min || 1;
  const x = (index: number) => (index / (values.length - 1)) * width;
  const y = (value: number) => height - 2 - ((value - min) / span) * (height - 4);
  const points = values.map((value, index) => `${x(index).toFixed(1)},${y(value).toFixed(1)}`).join(" ");
  const color = positive ? "#00D084" : "#FF4444";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-12 w-full" aria-hidden="true">
      {baseline != null ? (
        <line x1={0} x2={width} y1={y(baseline)} y2={y(baseline)} stroke="#6B6B6B" strokeDasharray="3 3" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      ) : null}
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
