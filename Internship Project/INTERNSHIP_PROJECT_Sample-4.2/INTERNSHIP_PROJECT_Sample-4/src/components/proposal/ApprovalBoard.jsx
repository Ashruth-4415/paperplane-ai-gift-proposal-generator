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
        const items = proposals.filter(p => (p.status || '').toLowerCase() === col.toLowerCase());
        const config = colConfig[col];
        const totalRevenue = items.reduce((sum, p) => sum + ((p.budget_per_unit * p.quantity) || p.budget || 0), 0);
        return (
          <div key={col} className={`flex flex-col rounded-2xl border ${config.border} ${config.bg} min-w-[180px]`}>
            <div className={`px-3 py-3 rounded-t-2xl ${config.headerBg} flex flex-col gap-2`}>
              <div className="flex items-center justify-between">
                <StatusBadge status={col} />
                <span className={`text-xs font-bold ${config.header}`}>{items.length} Proposals</span>
              </div>
              <div className={`text-sm font-extrabold ${config.header}`}>
                Revenue: {formatCurrency(totalRevenue)}
              </div>
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
                  <div className="flex justify-between items-start">
                    <p className="text-surface-100 text-xs font-bold group-hover:text-brand-600 transition-colors truncate">{p.clientName || p.client_name || 'Unknown'}</p>
                    <p className="text-surface-450 text-[10px] font-mono bg-surface-100/10 px-1.5 py-0.5 rounded">Token: {p.id}</p>
                  </div>
                  <p className="text-brand-600 text-xs font-extrabold mt-2">{formatCurrency((p.budget_per_unit * p.quantity) || p.budget || 0)}</p>
                  <p className="text-surface-500 text-[10px] mt-1">{formatDate(p.deliveryTimeline || p.created_at || p.updatedAt)}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
