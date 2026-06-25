import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-brand-600 hover:bg-brand-500 text-[#ffffff] border border-brand-500/50 shadow-glow hover:shadow-brand-500/20',
  secondary: 'bg-surface-700 hover:bg-surface-600 text-surface-100 border border-surface-600',
  ghost: 'bg-transparent hover:bg-surface-700/50 text-surface-300 hover:text-[#0f172a] border border-transparent hover:border-surface-600',
  danger: 'bg-rose-700 hover:bg-rose-600 text-[#ffffff] border border-rose-600',
  success: 'bg-emerald-700 hover:bg-emerald-600 text-[#ffffff] border border-emerald-600',
  outline: 'bg-transparent hover:bg-brand-600/10 text-brand-700 border border-brand-500/50 hover:border-brand-600',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-md gap-1',
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base rounded-xl gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon: Icon,
  iconRight: IconRight,
  fullWidth = false,
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-1 focus:ring-offset-surface-900',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className={`${size === 'xs' ? 'w-3 h-3' : 'w-4 h-4'}`} />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight className={`${size === 'xs' ? 'w-3 h-3' : 'w-4 h-4'}`} />}
    </button>
  );
}
