import { useState } from 'react';
import { RotateCcw, Clock, Package, CheckCircle, XCircle, FileCheck, Search, Filter, ChevronDown, User, Building2, Calendar, AlertTriangle, MessageSquare, Save, Eye, Image, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

const STATUS_CFG = {
  'Under Review': { icon: Clock,        color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200/60',   bar: 'bg-amber-500'   },
  Processing:    { icon: Package,       color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200/60',    bar: 'bg-blue-500'    },
  Approved:      { icon: CheckCircle,   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200/60', bar: 'bg-emerald-500' },
  Resolved:      { icon: FileCheck,     color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-200/60',  bar: 'bg-violet-500'  },
  Rejected:      { icon: XCircle,       color: 'text-rose-700',    bg: 'bg-rose-50',    border: 'border-rose-200/60',    bar: 'bg-rose-500'    },
};

const ALL_STATUSES = ['Under Review', 'Processing', 'Approved', 'Resolved', 'Rejected'];

const PROGRESS_STEPS = ['Submitted', 'Under Review', 'Processing', 'Approved', 'Resolved'];
const PROGRESS_IDX   = { 'Under Review': 1, Processing: 2, Approved: 3, Resolved: 4 };

export default function AdminReturns() {
  const { returnRequests, updateReturnStatus, showToast } = useApp();
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilter]   = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const [adminNote, setAdminNote]   = useState('');
  const [resolution, setResolution] = useState('');
  const [savingId, setSavingId]     = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const filtered = returnRequests.filter(r => {
    const matchSearch = !search ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.order.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const selected = returnRequests.find(r => r.id === selectedId);

  const openDetail = (ret) => {
    setSelectedId(ret.id);
    setAdminNote(ret.adminNote || '');
    setResolution(ret.resolutionNote || '');
  };

  const handleSave = (ret, newStatus) => {
    setSavingId(ret.id);
    setTimeout(() => {
      updateReturnStatus(ret.id, newStatus || ret.status, adminNote, resolution);
      showToast(`Return ${ret.id} updated successfully`, 'success');
      setSavingId(null);
    }, 700);
  };

  const counts = ALL_STATUSES.reduce((acc, s) => ({ ...acc, [s]: returnRequests.filter(r => r.status === s).length }), {});

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Return Requests</h1>
          <p className="text-surface-400 text-sm mt-1">Review, manage and resolve customer return requests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-surface-800 border border-surface-700/50 rounded-xl text-xs font-semibold text-surface-300">
            {returnRequests.length} Total
          </div>
          <div className="px-3 py-1.5 bg-amber-900/30 border border-amber-700/40 rounded-xl text-xs font-semibold text-amber-300">
            {counts['Under Review'] || 0} Pending Review
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {ALL_STATUSES.map(s => {
          const cfg = STATUS_CFG[s];
          const Icon = cfg.icon;
          return (
            <button
              key={s}
              onClick={() => setFilter(filterStatus === s ? 'All' : s)}
              className={`flex flex-col gap-1.5 p-3 rounded-xl border transition-all text-left ${
                filterStatus === s
                  ? `${cfg.bg} ${cfg.border} ring-1 ring-inset ${cfg.border}`
                  : 'bg-surface-800/50 border-surface-700/40 hover:border-surface-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                <span className={`text-[11px] font-semibold ${cfg.color}`}>{s}</span>
              </div>
              <span className="text-2xl font-bold text-surface-100">{counts[s] || 0}</span>
            </button>
          );
        })}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by RET ID, customer, product…"
            className="w-full pl-9 pr-4 py-2.5 bg-surface-800 border border-surface-700/50 rounded-xl text-sm text-surface-200 placeholder-surface-600 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus} onChange={e => setFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 bg-surface-800 border border-surface-700/50 rounded-xl text-sm text-surface-200 focus:outline-none focus:border-brand-500 transition-colors"
          >
            <option value="All">All Statuses</option>
            {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-3 w-4 h-4 text-surface-500 pointer-events-none" />
        </div>
      </div>

      {/* Main layout: list + detail */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

        {/* List */}
        <div className="xl:col-span-2 flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-surface-800/40 border border-surface-700/30 rounded-2xl">
              <RotateCcw className="w-10 h-10 text-surface-600 mb-3" />
              <p className="text-surface-400 text-sm font-medium">No return requests found</p>
              <p className="text-surface-600 text-xs mt-1">Try adjusting your search or filter</p>
            </div>
          )}
          {filtered.map(ret => {
            const cfg = STATUS_CFG[ret.status] || STATUS_CFG['Under Review'];
            const Icon = cfg.icon;
            const isActive = selectedId === ret.id;
            return (
              <button
                key={ret.id}
                onClick={() => openDetail(ret)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  isActive
                    ? `${cfg.bg} ${cfg.border} ring-1 ring-inset ${cfg.border}`
                    : 'bg-surface-800/60 border-surface-700/40 hover:border-surface-600'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {ret.photoData && (
                      <img src={ret.photoData} alt="Thumbnail" className="w-10 h-10 rounded object-cover border border-surface-700 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs font-bold text-brand-400">{ret.id}</span>
                        <span className="text-surface-600 text-xs">·</span>
                        <span className="text-surface-500 text-xs">{ret.order}</span>
                      </div>
                      <p className="text-surface-100 text-sm font-semibold truncate">{ret.product}</p>
                      <p className="text-surface-500 text-xs mt-0.5 truncate">{ret.reason} · {ret.qty} unit{ret.qty !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full border flex-shrink-0 ml-2 ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                    <Icon className="w-3 h-3" /> {ret.status}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
                      {(ret.customerName || 'U').slice(0, 1)}
                    </div>
                    <span className="text-surface-400 text-xs">{ret.customerName || 'Unknown'}</span>
                  </div>
                  <span className="text-surface-600 text-xs">·</span>
                  <span className="text-surface-600 text-xs">{formatRelativeTime(ret.updated)}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="xl:col-span-3">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-surface-800/30 border border-surface-700/30 border-dashed rounded-2xl text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700/50 flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-surface-600" />
              </div>
              <p className="text-surface-400 font-medium text-sm">Select a return request</p>
              <p className="text-surface-600 text-xs mt-1">Click any request on the left to view full details</p>
            </div>
          ) : (() => {
            const cfg = STATUS_CFG[selected.status] || STATUS_CFG['Under Review'];
            const Icon = cfg.icon;
            const progressStep = PROGRESS_IDX[selected.status] || 0;
            return (
              <div className="bg-surface-800/60 border border-surface-700/40 rounded-2xl overflow-hidden">
                {/* Panel header */}
                <div className={`px-5 py-4 border-b ${cfg.border} ${cfg.bg} flex items-center justify-between gap-3`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${cfg.border} ${cfg.bg}`}>
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-sm font-bold ${cfg.color}`}>{selected.id}</span>
                        <span className="text-surface-600 text-xs">·</span>
                        <span className="text-surface-500 text-xs">{selected.order}</span>
                      </div>
                      <p className="text-surface-200 text-sm font-semibold">{selected.product}</p>
                    </div>
                  </div>
                  <div className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                    {selected.status}
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-5">

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-3 bg-surface-900/50 rounded-xl border border-surface-700/30">
                      <User className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-surface-500 text-[11px] font-semibold uppercase tracking-wider mb-0.5">Customer</p>
                        <p className="text-surface-100 text-sm font-semibold">{selected.customerName || '—'}</p>
                        <p className="text-surface-500 text-xs">{selected.customerEmail || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-surface-900/50 rounded-xl border border-surface-700/30">
                      <Building2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-surface-500 text-[11px] font-semibold uppercase tracking-wider mb-0.5">Company</p>
                        <p className="text-surface-100 text-sm font-semibold">{selected.companyName || '—'}</p>
                        <p className="text-surface-500 text-xs">{selected.preferredResolution} requested</p>
                      </div>
                    </div>
                  </div>

                  {/* Return Details */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 bg-surface-900/50 rounded-xl border border-surface-700/30 text-center">
                      <p className="text-surface-500 text-[11px] uppercase tracking-wider mb-1">Quantity</p>
                      <p className="text-surface-100 text-lg font-bold">{selected.qty}</p>
                      <p className="text-surface-600 text-[10px]">units</p>
                    </div>
                    <div className="p-3 bg-surface-900/50 rounded-xl border border-surface-700/30 text-center">
                      <p className="text-surface-500 text-[11px] uppercase tracking-wider mb-1">Photos</p>
                      <p className="text-surface-100 text-lg font-bold">{selected.photoData ? '1' : '0'}</p>
                      <p className="text-surface-600 text-[10px]">{selected.photoData ? 'Attached' : 'None'}</p>
                    </div>
                    <div className="p-3 bg-surface-900/50 rounded-xl border border-surface-700/30 text-center">
                      <p className="text-surface-500 text-[11px] uppercase tracking-wider mb-1">Submitted</p>
                      <p className="text-surface-100 text-xs font-semibold mt-1">{formatDate(selected.created)}</p>
                    </div>
                  </div>

                  {/* Reason + Description */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2 p-3 bg-surface-900/50 rounded-xl border border-surface-700/30">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-surface-500 text-[11px] font-semibold uppercase tracking-wider mb-0.5">Return Reason</p>
                        <p className="text-surface-200 text-sm font-semibold">{selected.reason}</p>
                      </div>
                    </div>
                    {selected.description && (
                      <div className="p-3 bg-surface-900/50 rounded-xl border border-surface-700/30">
                        <p className="text-surface-500 text-[11px] font-semibold uppercase tracking-wider mb-1.5">Customer Description</p>
                        <p className="text-surface-300 text-sm leading-relaxed">{selected.description}</p>
                      </div>
                    )}
                    {selected.photoData && (
                      <div className="p-3 bg-surface-900/50 rounded-xl border border-surface-700/30">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-surface-500 text-[11px] font-semibold uppercase tracking-wider">Attached Photo</p>
                          <a 
                            href={selected.photoData} 
                            download={`return-${selected.id}-photo.jpg`}
                            className="text-brand-400 hover:text-brand-300 text-xs flex items-center gap-1 font-semibold transition-colors bg-brand-900/20 px-2 py-1 rounded border border-brand-700/30"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </a>
                        </div>
                        <div className="relative group rounded-lg overflow-hidden border border-surface-700/50 cursor-pointer" onClick={() => setPreviewImage(selected.photoData)}>
                           <img src={selected.photoData} alt="Damage preview" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                             <Eye className="w-6 h-6 text-white" />
                           </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress bar */}
                  {selected.status !== 'Rejected' && (
                    <div>
                      <p className="text-surface-500 text-[11px] font-semibold uppercase tracking-wider mb-3">Progress</p>
                      <div className="flex items-center justify-between mb-2">
                        {PROGRESS_STEPS.map((step, idx) => (
                          <div key={step} className="flex flex-col items-center gap-1 flex-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                              idx < progressStep ? `${cfg.bar} border-transparent text-white`
                              : idx === progressStep ? `border-2 ${cfg.color.replace('text-', 'border-')} ${cfg.bg} ${cfg.color}`
                              : 'bg-surface-800 border-surface-600 text-surface-600'
                            }`}>
                              {idx < progressStep ? '✓' : idx + 1}
                            </div>
                            <span className={`text-[9px] text-center leading-tight ${
                              idx <= progressStep ? cfg.color : 'text-surface-600'
                            }`}>{step}</span>
                          </div>
                        ))}
                      </div>
                      <div className="relative h-1.5 bg-surface-700 rounded-full">
                        <div className={`absolute left-0 top-0 h-1.5 ${cfg.bar} rounded-full transition-all duration-500`}
                          style={{ width: `${(progressStep / (PROGRESS_STEPS.length - 1)) * 100}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Admin Actions */}
                  <div className="border-t border-surface-700/40 pt-4 flex flex-col gap-3">
                    <p className="text-surface-300 text-sm font-semibold">Admin Actions</p>

                    {/* Status change */}
                    <div className="flex gap-2 flex-wrap">
                      {ALL_STATUSES.filter(s => s !== selected.status).map(s => {
                        const sCfg = STATUS_CFG[s];
                        return (
                          <button
                            key={s}
                            onClick={() => handleSave(selected, s)}
                            disabled={savingId === selected.id}
                            className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                              savingId === selected.id ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                            } ${sCfg.bg} ${sCfg.color} ${sCfg.border}`}
                          >
                            → Mark as {s}
                          </button>
                        );
                      })}
                    </div>

                    {/* Admin note */}
                    <div>
                      <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Internal Admin Note</label>
                      <textarea
                        rows={2}
                        value={adminNote}
                        onChange={e => setAdminNote(e.target.value)}
                        placeholder="Internal note (not visible to customer)…"
                        className="w-full bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-sm text-surface-200 placeholder-surface-600 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                      />
                    </div>

                    {/* Resolution note */}
                    <div>
                      <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-1.5">Resolution Note (visible to customer)</label>
                      <textarea
                        rows={2}
                        value={resolution}
                        onChange={e => setResolution(e.target.value)}
                        placeholder="What action was taken? e.g. Replacement batch dispatched on Jun 15…"
                        className="w-full bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-sm text-surface-200 placeholder-surface-600 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                      />
                    </div>

                    <button
                      onClick={() => handleSave(selected)}
                      disabled={savingId === selected.id}
                      className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        savingId === selected.id
                          ? 'bg-surface-700 text-surface-500 cursor-not-allowed'
                          : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg hover:shadow-brand-500/25'
                      }`}
                    >
                      <Save className="w-4 h-4" />
                      {savingId === selected.id ? 'Saving…' : 'Save Notes'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <img src={previewImage} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-brand-400 bg-surface-900/50 hover:bg-surface-800 rounded-full p-2 transition-all"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
