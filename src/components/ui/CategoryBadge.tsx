import type { TransactionType } from '../../types';
import { brand } from '../../lib/theme';

export function CategoryBadge({ type }: { type: TransactionType }) {
  const isIncome = type === 'INCOME';
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        background: isIncome ? 'rgba(46,189,115,0.12)' : 'rgba(242,115,79,0.12)',
        color: isIncome ? brand.success : brand.danger,
      }}
    >
      {isIncome ? 'Ingreso' : 'Gasto'}
    </span>
  );
}
