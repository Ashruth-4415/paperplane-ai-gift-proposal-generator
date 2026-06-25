import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export default function MetricCard({ title, value, change, changeLabel, icon: Icon, color = 'brand', format = 'number', subtitle, onClick }) {
  const colorMap = {
    brand: { icon: 'bg-brand-50 border border-brand-200/60 text-brand-600', value: 'text-brand-600' },
    emerald: { icon: 'bg-emerald-50 border border-emerald-200/60 text-emerald-600', value: 'text-emerald-600' },
    amber: { icon: 'bg-amber-50 border border-amber-200/60 text-amber-600', value: 'text-amber-600' },
    rose: { icon: 'bg-rose-50 border border-rose-200/60 text-rose-600', value: 'text-rose-600' },
    violet: { icon: 'bg-violet-50 border border-violet-200/60 text-violet-600', value: 'text-violet-600' },
    blue: { icon: 'bg-blue-50 border border-blue-200/60 text-blue-600', value: 'text-blue-600' },
  };
  const c = colorMap[color] || colorMap.brand;

  const formatted = format === 'currency' ? formatCurrency(value) : format === 'percent' ? `${value}%` : format === 'string' ? String(value) : formatNumber(value);

  const isPositive = change > 0;
  const isNeutral = change === 0;
  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const trendColor = isNeutral ? 'text-surface-400' : isPositive ? 'text-emerald-600' : 'text-rose-600';

  return (
    <div 
      onClick={onClick}
      className={`bg-[#ffffff] border border-slate-900 rounded-2xl p-5 hover:border-brand-500/30 transition-all hover:shadow-card-hover group ${onClick ? 'cursor-pointer select-none active:scale-[0.98]' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon} transition-transform group-hover:scale-110`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className={`text-2xl font-black tracking-tight ${c.value}`}>{formatted}</p>
      <p className="text-surface-200 text-sm font-semibold mt-1">{title}</p>
      {subtitle && <p className="text-surface-400 text-xs mt-0.5">{subtitle}</p>}
      {changeLabel && <p className="text-surface-450 text-xs mt-1 font-medium">{changeLabel}</p>}
    </div>
  );
}
