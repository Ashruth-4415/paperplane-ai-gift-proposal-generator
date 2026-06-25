import { STATUS_CONFIG, PRIORITY_CONFIG } from '../../utils/constants';

export default function StatusBadge({ status, pulse = false }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    bg: 'bg-surface-700',
    text: 'text-surface-300',
    dot: 'bg-surface-400',
    border: 'border-surface-600',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${(config.pulse || pulse) ? 'animate-pulse' : ''}`} />
      {config.label || status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Low;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {priority}
    </span>
  );
}
