import { useState, useRef, useEffect } from 'react';
import { RotateCcw, Upload, ChevronDown, CheckCircle, Clock, XCircle, Package, Image, AlertTriangle, Send, X, FileCheck } from 'lucide-react';
import { SelectInput, TextArea } from '../../components/common/Input';
import Button from '../../components/common/Button';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

const RETURN_REASONS = [
  'Damaged on Delivery', 'Wrong Item Received', 'Quality Below Standard',
  'Branding / Logo Error', 'Wrong Quantity Delivered', 'Product Not as Described',
  'Packaging Damaged', 'Item Expired (Food/Perishable)', 'Change of Requirements', 'Other',
];



const RETURN_STATUSES = {
  'Under Review': { icon: Clock, color: 'text-amber-800', bg: 'bg-amber-100/80', border: 'border-amber-300/60', barColor: 'bg-amber-500' },
  Processing: { icon: Package, color: 'text-blue-700', bg: 'bg-blue-100/80', border: 'border-blue-300/60', barColor: 'bg-blue-500' },
  Approved: { icon: CheckCircle, color: 'text-emerald-700', bg: 'bg-emerald-100/80', border: 'border-emerald-300/60', barColor: 'bg-emerald-500' },
  Resolved: { icon: FileCheck, color: 'text-violet-700', bg: 'bg-violet-100/80', border: 'border-violet-300/60', barColor: 'bg-violet-500' },
  Rejected: { icon: XCircle, color: 'text-rose-700', bg: 'bg-rose-100/80', border: 'border-rose-300/60', barColor: 'bg-rose-500' },
};

const RETURN_PROGRESS = {
  'Under Review': 1, Processing: 2, Approved: 3, Resolved: 4, Rejected: -1,
};

const PROGRESS_STEPS = ['Submitted', 'Under Review', 'Processing', 'Approved', 'Resolved'];


export default function ReturnRequest() {
  const { showToast, currentUser, returnRequests, addReturnRequest, addNotification, orders, proposals } = useApp();
  const fileRef = useRef(null);
  const [returns, setReturns] = useState(returnRequests);

  // Sync with context returns
  useEffect(() => {
    setReturns(returnRequests);
  }, [returnRequests]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [expandedReturn, setExpandedReturn] = useState(null);

  const pastOrdersOptions = [
    ...(orders || []).flatMap(o => 
      (o.items || []).map(i => ({
        id: `${o.id}-${i.id}`,
        orderId: o.id,
        label: `${o.id} — ${i.name} × ${i.qty}`,
        product: i.name,
        qty: i.qty,
        date: o.orderDate
      }))
    ),
    ...(proposals || []).filter(p => ['Approved', 'Dispatched', 'Resolved'].includes(p.status)).map(p => ({
      id: p.id,
      orderId: p.id,
      label: `${p.id} — ${p.clientName}: ${p.occasion || 'Proposal'} × ${p.quantity}`,
      product: p.occasion || 'Custom Gift Proposal',
      qty: p.quantity,
      date: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'N/A'
    }))
  ];

  const [form, setForm] = useState({
    orderId: '', reason: '', returnQty: '', description: '', preferredResolution: 'Replacement',
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedFiles(prev => [...prev, { 
          name: f.name, 
          size: (f.size / 1024).toFixed(1) + ' KB', 
          id: Date.now() + Math.random(),
          dataUrl: event.target.result
        }]);
      };
      reader.readAsDataURL(f);
    });
  };

  const removeFile = (id) => setUploadedFiles(prev => prev.filter(f => f.id !== id));

  const handleSubmit = async () => {
    if (!form.orderId || !form.reason || !form.returnQty) { showToast('Please fill all required fields.', 'error'); return; }
    setLoading(true);
    const selectedOrder = pastOrdersOptions.find(o => o.id === form.orderId);
    
    // Simulate slight loading delay for UX
    await new Promise(r => setTimeout(r, 1500));
    
    try {
      const newReturn = {
        id: `RET-00${returns.length + 4}`,
        orderId: selectedOrder?.orderId || form.orderId,
        itemName: selectedOrder?.product || 'Unknown Product',
        qty: parseInt(form.returnQty),
        reason: form.reason,
        status: 'Pending',
        hasImages: uploadedFiles.length > 0,
        photoData: uploadedFiles.length > 0 ? uploadedFiles[0].dataUrl : null,
        description: form.description,
        preferredResolution: form.preferredResolution,
      };
      const realReturn = await addReturnRequest(newReturn);
      if (!realReturn) throw new Error("Failed to create return request");

      addNotification({ type: 'alert', message: `New return request ${realReturn.id} from ${currentUser?.name || 'Customer'} — ${newReturn.reason}`, role: 'admin', link: '/admin/returns' });
      setLoading(false);
      setSubmitted(true);
      setSubmittedId(realReturn.id);
      showToast(`Return request ${realReturn.id} submitted! Expect a response within 48 hours.`, 'success');
    } catch (e) {
      setLoading(false);
      showToast('Error submitting request', 'error');
    }
  };

  const reset = () => {
    setSubmitted(false);
    setForm({ orderId: '', reason: '', returnQty: '', preferredResolution: 'Replacement', description: '' });
    setUploadedFiles([]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-100">Return Request</h1>
        <p className="text-surface-400 text-sm mt-1">Initiate a return or replacement for damaged, incorrect, or unsatisfactory items</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FORM */}
        <div className="relative overflow-hidden bg-[#ffffff] border border-surface-700/65 rounded-3xl p-7 shadow-lg shadow-surface-700/10 hover:shadow-xl hover:shadow-surface-700/15 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-brand-500 to-indigo-500" />
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-md shadow-rose-500/25">
              <RotateCcw className="w-5.5 h-5.5 text-[#ffffff]" />
            </div>
            <div>
              <h2 className="text-surface-100 font-extrabold text-base">New Return Request</h2>
              <p className="text-surface-400 text-xs mt-0.5">Takes 2-3 business days to process</p>
            </div>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center shadow-sm shadow-emerald-500/10">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-surface-100 font-bold text-lg">Return Submitted!</p>
                <p className="text-surface-300 text-sm mt-1">Reference: <span className="font-mono font-bold text-brand-600">{submittedId}</span></p>
                <p className="text-surface-400 text-xs mt-0.5">Our team will review within 48 hours</p>
              </div>
              <Button variant="ghost" icon={RotateCcw} onClick={reset}>Submit Another Return</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Order Selector */}
              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1.5">Select Past Order *</label>
                <div className="relative">
                  <select value={form.orderId} onChange={e => set('orderId', e.target.value)} className="w-full appearance-none bg-[#ffffff] border border-surface-600 rounded-xl px-3 py-2.5 text-surface-100 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 hover:border-surface-400 transition-all pr-8 shadow-sm">
                    <option value="">— Choose an order —</option>
                    {pastOrdersOptions.length === 0 && <option value="" disabled>No past orders found</option>}
                    {pastOrdersOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-3.5 w-4 h-4 text-surface-400 pointer-events-none" />
                </div>
                {form.orderId && (
                  <div className="mt-2 p-3 bg-brand-50/20 rounded-xl border border-brand-100 text-xs text-surface-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                    <span className="text-surface-200 font-semibold">{pastOrdersOptions.find(o => o.id === form.orderId)?.product}</span>
                    <span className="text-surface-400">· Delivered: {pastOrdersOptions.find(o => o.id === form.orderId)?.date}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Quantity to Return *</label>
                  <input type="number" min="1" value={form.returnQty} onChange={e => set('returnQty', e.target.value)} placeholder="e.g. 12" className="w-full bg-[#ffffff] border border-surface-600 rounded-xl px-3 py-2.5 text-surface-100 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 hover:border-surface-400 transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-surface-300 mb-1.5">Preferred Resolution</label>
                  <div className="relative">
                    <select value={form.preferredResolution} onChange={e => set('preferredResolution', e.target.value)} className="w-full appearance-none bg-[#ffffff] border border-surface-600 rounded-xl px-3 py-2.5 text-surface-100 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 hover:border-surface-400 transition-all pr-8 shadow-sm">
                      <option>Replacement</option>
                      <option>Refund</option>
                      <option>Store Credit</option>
                      <option>Repair / Redo</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-3.5 w-4 h-4 text-surface-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <SelectInput
                label="Return Reason *"
                id="ret-reason"
                options={RETURN_REASONS}
                value={form.reason}
                onChange={e => set('reason', e.target.value)}
                className="!bg-[#ffffff] !border-surface-600 focus:!ring-2 focus:!ring-brand-500/10 hover:!border-surface-400 !rounded-xl !py-2.5"
              />

              <TextArea
                label="Detailed Description *"
                id="ret-desc"
                rows={4}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe the issue in detail — when was it noticed, how many items are affected, visible damage description, etc."
                className="!bg-[#ffffff] !border-surface-600 focus:!ring-2 focus:!ring-brand-500/10 hover:!border-surface-400 !rounded-xl !py-2.5"
              />

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-surface-300 mb-1.5">Upload Damage Photos (optional)</label>
                <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" onChange={handleFileUpload} />
                <div onClick={() => fileRef.current?.click()} className="cursor-pointer flex flex-col items-center justify-center gap-2.5 p-5 border-2 border-dashed border-brand-200/80 bg-brand-50/10 hover:border-brand-500 hover:bg-brand-50/30 rounded-xl transition-all duration-200 group">
                  <Upload className="w-6 h-6 text-brand-500 group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-center">
                    <p className="text-surface-100 font-semibold text-sm">Click to upload photos</p>
                    <p className="text-surface-400 text-xs mt-0.5">JPG, PNG · Max 5MB each · Up to 5 files</p>
                  </div>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5 animate-fade-in">
                    {uploadedFiles.map(f => (
                      <div key={f.id} className="flex items-center gap-2 bg-[#ffffff] border border-surface-600 rounded-lg px-3 py-2 shadow-sm">
                        <Image className="w-4 h-4 text-brand-500 flex-shrink-0" />
                        <span className="text-surface-200 text-xs flex-1 truncate font-medium">{f.name}</span>
                        <span className="text-surface-400 text-xs">{f.size}</span>
                        <button onClick={() => removeFile(f.id)} className="text-surface-400 hover:text-rose-600 transition-colors p-0.5 hover:bg-rose-50 rounded"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button loading={loading} icon={Send} fullWidth onClick={handleSubmit}>Submit Return Request</Button>
            </div>
          )}
        </div>

        {/* RETURN HISTORY */}
        <div className="flex flex-col gap-4">
          <h2 className="text-surface-100 font-semibold text-sm">Return History</h2>
          {returns.map(ret => {
            const cfg = RETURN_STATUSES[ret.status] || RETURN_STATUSES['Under Review'];
            const StatusIcon = cfg.icon;
            const progressStep = RETURN_PROGRESS[ret.status] || 0;
            const isExpanded = expandedReturn === ret.id;

            return (
              <div key={ret.id} className={`bg-surface-800 border ${cfg.border} rounded-2xl overflow-hidden`}>
                <div className="p-4 cursor-pointer" onClick={() => setExpandedReturn(isExpanded ? null : ret.id)}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs text-brand-400">{ret.id}</span>
                        <span className="text-surface-600 text-xs">·</span>
                        <span className="text-surface-500 text-xs">{ret.order}</span>
                      </div>
                      <p className="text-surface-200 text-sm font-semibold">{ret.product}</p>
                      <p className="text-surface-500 text-xs mt-0.5">{ret.reason} · {ret.qty} unit{ret.qty !== 1 ? 's' : ''}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border flex-shrink-0 ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                      <StatusIcon className="w-3.5 h-3.5" /> {ret.status}
                    </div>
                  </div>
                  <p className="text-surface-600 text-xs">{ret.hasImages ? '📎 Photos attached' : 'No photos'} · Updated {formatRelativeTime(ret.updated)}</p>
                </div>

                {isExpanded && (
                  <div className="border-t border-surface-700/30 px-4 py-4 animate-fade-in">
                    {/* Progress Bar */}
                    {ret.status !== 'Rejected' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          {PROGRESS_STEPS.map((step, idx) => (
                            <div key={step} className="flex flex-col items-center gap-1 flex-1">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${idx <= progressStep ? `${cfg.barColor} border-transparent text-white` : 'bg-surface-800 border-surface-600 text-surface-600'}`}>
                                {idx < progressStep ? '✓' : idx + 1}
                              </div>
                              <span className={`text-[9px] text-center leading-tight ${idx <= progressStep ? cfg.color : 'text-surface-600'}`}>{step}</span>
                            </div>
                          ))}
                        </div>
                        <div className="relative h-1 bg-surface-700 rounded-full mt-1">
                          <div className={`absolute left-0 top-0 h-1 ${cfg.barColor} rounded-full transition-all`} style={{ width: `${(progressStep / (PROGRESS_STEPS.length - 1)) * 100}%` }} />
                        </div>
                      </div>
                    )}

                    {ret.resolutionNote && (
                      <div className={`p-3 rounded-xl border ${cfg.bg} ${cfg.border} flex items-start gap-2`}>
                        <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${cfg.color}`} />
                        <p className={`text-xs ${cfg.color}`}>{ret.resolutionNote}</p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-3">
                      <div className="flex-1 text-xs"><span className="text-surface-500">Created: </span><span className="text-surface-300">{formatDate(ret.created)}</span></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
