import { ChevronRight, Clock } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';
import Button from '../common/Button';

export default function ActionList({ title = 'Pending Actions', items = [], onAction }) {
  return (
    <div className="bg-surface-800 border border-surface-700/50 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-700/40 flex items-center justify-between">
        <h3 className="text-surface-100 font-semibold text-sm">{title}</h3>
        <span className="text-xs text-surface-500">{items.length} items</span>
      </div>
      <div className="divide-y divide-surface-700/30">
        {items.length === 0 ? (
          <p className="py-8 text-center text-surface-500 text-sm">All caught up! ✓</p>
        ) : (
          items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-700/20 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                item.urgency === 'high' 
                  ? 'bg-rose-50 border-rose-200/80 text-rose-700' 
                  : item.urgency === 'medium' 
                  ? 'bg-amber-50 border-amber-200/80 text-amber-700' 
                  : 'bg-surface-100 border-surface-200/80 text-surface-700'
              }`}>
                {item.icon ? <item.icon className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-surface-200 text-sm font-medium truncate">{item.label}</p>
                <p className="text-surface-500 text-xs truncate">{item.description}</p>
                {item.time && <p className="text-surface-600 text-xs">{formatRelativeTime(item.time)}</p>}
              </div>
              {item.cta && (
                <Button variant="ghost" size="xs" onClick={() => onAction && onAction(item)} className="flex-shrink-0">
                  {item.cta} <ChevronRight className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
