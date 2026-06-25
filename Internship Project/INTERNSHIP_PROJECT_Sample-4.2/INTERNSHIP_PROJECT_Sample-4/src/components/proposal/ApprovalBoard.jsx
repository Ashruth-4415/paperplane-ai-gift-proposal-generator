import StatusBadge from '../common/StatusBadge';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

const COLUMNS = ['Approved', 'Rejected'];

const colConfig = {
  Approved: { bg: 'bg-emerald-50/60', border: 'border-emerald-200/80', header: 'text-emerald-700', headerBg: 'bg-emerald-100/70' },
  Rejected: { bg: 'bg-rose-50/60', border: 'border-rose-200/80', header: 'text-rose-700', headerBg: 'bg-rose-100/70' },
};

export default function ApprovalBoard({ proposals = [] }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
      {COLUMNS.map(col => {
        const items = proposals.filter(p => p.status === col);
        const config = colConfig[col];
        return (
          <div key={col} className={`flex flex-col rounded-2xl border ${config.border} ${config.bg} min-w-[180px]`}>
            <div className={`px-3 py-2.5 rounded-t-2xl ${config.headerBg} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <StatusBadge status={col} />
              </div>
              <span className={`text-xs font-bold ${config.header}`}>{items.length}</span>
            </div>
            <div className="flex flex-col gap-2 p-2 overflow-y-auto" style={{ maxHeight: '400px' }}>
              {items.length === 0 && (
                <p className="text-center text-surface-500 text-xs py-4">—</p>
              )}
              {items.map(p => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/admin/proposals/${p.id}`)}
                  className="bg-[#ffffff] border border-slate-900/10 rounded-xl p-3 cursor-pointer hover:border-brand-500/50 hover:shadow-card-hover transition-all group"
                >
                  <p className="text-surface-100 text-xs font-bold group-hover:text-brand-600 transition-colors truncate">{p.clientName}</p>
                  <p className="text-surface-450 text-[10px] font-mono mt-0.5">{p.id}</p>
                  <p className="text-brand-600 text-xs font-extrabold mt-1.5">{formatCurrency(p.budget)}</p>
                  <p className="text-surface-500 text-xs mt-0.5">{formatDate(p.deliveryTimeline)}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
