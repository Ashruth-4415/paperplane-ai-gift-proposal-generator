import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

const baseInput = 'w-full bg-surface-900 border border-surface-700 rounded-lg px-3 py-2 text-surface-100 text-sm placeholder-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-colors';

export function TextInput({ label, id, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-sm font-medium text-surface-300">{label}</label>}
      <input id={id} className={`${baseInput} ${error ? 'border-rose-500' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

export function SelectInput({ label, id, options = [], error, placeholder = 'Select...', className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-sm font-medium text-surface-300">{label}</label>}
      <div className="relative">
        <select id={id} className={`${baseInput} appearance-none pr-8 ${error ? 'border-rose-500' : ''} ${className}`} {...props}>
          <option value="" disabled>{placeholder}</option>
          {options.map(opt => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

export function RangeSlider({ label, id, min, max, value, onChange, formatValue, error }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-sm font-medium text-surface-300">{label}</label>
          <span className="text-sm font-semibold text-brand-400">{formatValue ? formatValue(value) : value}</span>
        </div>
      )}
      <div className="relative h-6 flex items-center">
        <div className="absolute left-0 right-0 h-1.5 bg-surface-700 rounded-full" />
        <div className="absolute left-0 h-1.5 bg-gradient-to-r from-brand-600 to-brand-400 rounded-full" style={{ width: `${pct}%` }} />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className="absolute w-full h-1.5 opacity-0 cursor-pointer z-10"
        />
        <div className="absolute w-4 h-4 bg-brand-400 rounded-full shadow-lg border-2 border-surface-900 pointer-events-none transition-all" style={{ left: `calc(${pct}% - 8px)` }} />
      </div>
      <div className="flex justify-between text-xs text-surface-500">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

export function MultiSelect({ label, options = [], selected = [], onChange, error }) {
  const [open, setOpen] = useState(false);
  const toggle = (val) => onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);
  const remove = (val) => onChange(selected.filter(v => v !== val));

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-surface-300">{label}</label>}
      <div className="relative">
        <div
          className={`${baseInput} min-h-[38px] flex flex-wrap gap-1 cursor-pointer ${error ? 'border-rose-500' : ''}`}
          onClick={() => setOpen(!open)}
        >
          {selected.length === 0 && <span className="text-surface-500">Select options...</span>}
          {selected.map(val => (
            <span key={val} className="inline-flex items-center gap-1 bg-brand-600/30 text-brand-300 border border-brand-500/30 text-xs rounded-md px-2 py-0.5">
              {val}
              <X className="w-3 h-3 cursor-pointer hover:text-rose-300" onClick={(e) => { e.stopPropagation(); remove(val); }} />
            </span>
          ))}
          <ChevronDown className="ml-auto w-4 h-4 text-surface-400 flex-shrink-0 self-center" />
        </div>
        {open && (
          <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-surface-800 border border-surface-600 rounded-lg shadow-xl max-h-48 overflow-y-auto">
            {options.map(opt => (
              <div
                key={opt}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2 ${selected.includes(opt) ? 'bg-brand-600/20 text-brand-300' : 'text-surface-200 hover:bg-surface-700'}`}
                onClick={() => toggle(opt)}
              >
                <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${selected.includes(opt) ? 'bg-brand-600 border-brand-500' : 'border-surface-500'}`}>
                  {selected.includes(opt) && <span className="w-2 h-2 bg-white rounded-sm" />}
                </span>
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

export function TextArea({ label, id, error, className = '', rows = 3, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-sm font-medium text-surface-300">{label}</label>}
      <textarea id={id} rows={rows} className={`${baseInput} resize-none ${error ? 'border-rose-500' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

export default TextInput;
