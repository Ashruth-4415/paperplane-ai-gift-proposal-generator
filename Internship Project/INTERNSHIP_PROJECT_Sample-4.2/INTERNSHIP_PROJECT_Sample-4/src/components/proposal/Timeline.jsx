import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { CheckCircle, Clock, FileText, Zap, Palette, Package, Truck } from 'lucide-react';

const statusIcons = {
  Draft: FileText,
  'AI-Processing': Zap,
  'Designer-Review': Palette,
  Approved: CheckCircle,
  Dispatched: Truck,
};

const statusColors = {
  Draft: 'bg-surface-700 border-surface-600 text-surface-400',
  'AI-Processing': 'bg-blue-900/30 border-blue-500/40 text-blue-400',
  'Designer-Review': 'bg-amber-900/30 border-amber-500/40 text-amber-400',
  Approved: 'bg-emerald-900/30 border-emerald-500/40 text-emerald-400',
  Dispatched: 'bg-violet-900/30 border-violet-500/40 text-violet-400',
};

const lineColors = {
  Draft: 'bg-surface-600',
  'AI-Processing': 'bg-blue-500/50',
  'Designer-Review': 'bg-amber-500/50',
  Approved: 'bg-emerald-500/50',
  Dispatched: 'bg-violet-500/50',
};

export default function Timeline({ events = [] }) {
  if (!events.length) {
    return (
      <div className="text-center py-8 text-surface-500 text-sm">No history available</div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {events.map((event, i) => {
        const Icon = statusIcons[event.status] || Clock;
        const isLast = i === events.length - 1;
        const colorClass = statusColors[event.status] || statusColors.Draft;
        const lineColor = lineColors[event.status] || lineColors.Draft;

        return (
          <div key={event.id} className="flex gap-4">
            {/* Icon + Line */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              {!isLast && <div className={`w-0.5 flex-1 my-1 min-h-[24px] ${lineColor}`} />}
            </div>

            {/* Content */}
            <div className={`flex-1 pb-5 ${isLast ? 'pb-0' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-surface-100 text-sm font-medium">{event.action}</p>
                  <p className="text-surface-500 text-xs mt-0.5">by <span className="text-surface-300">{event.actor}</span></p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-surface-400 text-xs">{formatRelativeTime(event.timestamp)}</p>
                  <p className="text-surface-600 text-xs">{formatDate(event.timestamp, { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className={`inline-flex items-center gap-1 mt-2 text-xs px-2 py-0.5 rounded-full border ${colorClass}`}>
                <Icon className="w-3 h-3" />
                {event.status}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
