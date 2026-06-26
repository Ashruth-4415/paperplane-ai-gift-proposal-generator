import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { PriorityBadge } from '../common/StatusBadge';
import { useNavigate } from 'react-router-dom';

export default function PriorityQueue({ title = 'Priority Queue', items = [], type = 'proposals' }) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-800 border border-surface-700/50 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-700/40 flex items-center justify-between">
        <h3 className="text-surface-100 font-semibold text-sm">{title}</h3>
        <span className="bg-rose-50 text-rose-700 border border-rose-200/80 text-xs px-2.5 py-0.5 rounded-full font-bold">
          {items.length} High Priority
        </span>
      </div>
      <div className="divide-y divide-surface-700/30">
        {items.length === 0 ? (
          <p className="py-8 text-center text-surface-500 text-sm">No items</p>
        ) : (
          items.map((item, i) => {
            const isHighPriority = item.priority === 'High' || item.status === 'Designer-Review' || (item.budget_per_unit && item.budget_per_unit * item.quantity >= 5000) || item.budget >= 5000;
            return (
            <div
              key={item.id || i}
              className="flex items-center gap-3 px-5 py-3 hover:bg-surface-700/20 transition-colors cursor-pointer"
              onClick={() => type === 'proposals' && navigate(`/proposals/${item.id}`)}
            >
              <span className="text-surface-500 text-xs w-5 flex-shrink-0">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-surface-200 text-sm font-medium truncate">{item.clientName || item.client_name || item.name}</p>
                <p className="text-surface-500 text-xs">{item.id} · {item.clientType || item.client_type}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <PriorityBadge priority={item.priority || (isHighPriority ? 'High' : 'Medium')} />
                {item.budget && <span className="text-xs text-brand-600 font-bold">{formatCurrency(item.budget)}</span>}
              </div>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
}
