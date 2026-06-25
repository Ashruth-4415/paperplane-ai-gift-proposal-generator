export default function Card({ children, className = '', hover = false, glass = false, padding = true, onClick }) {
  return (
    <div
      onClick={onClick}
      className={[
        'rounded-xl border transition-all duration-200',
        glass
          ? 'bg-surface-800/60 backdrop-blur-sm border-surface-700/50'
          : 'bg-surface-800 border-surface-700/50',
        hover ? 'hover:border-brand-500/40 hover:shadow-card-hover cursor-pointer hover:-translate-y-0.5' : '',
        padding ? 'p-5' : '',
        'shadow-card',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, icon: Icon }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-brand-600/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-brand-400" />
          </div>
        )}
        <div>
          <h3 className="text-surface-100 font-semibold text-sm">{title}</h3>
          {subtitle && <p className="text-surface-400 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
