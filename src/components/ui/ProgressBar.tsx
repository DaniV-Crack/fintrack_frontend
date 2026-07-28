import { brand } from '../../lib/theme';

interface ProgressBarProps {
  percentage: number;
  height?: number;
}

export function ProgressBar({ percentage, height = 8 }: ProgressBarProps) {
  const capped = Math.min(percentage, 100);
  const color = percentage >= 100 ? brand.danger : percentage >= 80 ? brand.accent : brand.success;
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height, background: brand.bg }}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${capped}%`, background: color }}
      />
    </div>
  );
}
