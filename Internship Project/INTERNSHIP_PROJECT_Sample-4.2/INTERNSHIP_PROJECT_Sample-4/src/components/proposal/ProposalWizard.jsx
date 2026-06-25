import { useState } from 'react';
import { Check, ChevronRight, Building2, Package, Palette, Clock, Eye, Loader2, Sparkles } from 'lucide-react';
import { TextInput, SelectInput, RangeSlider, MultiSelect, TextArea } from '../common/Input';
import Button from '../common/Button';
import { CLIENT_TYPES, BRANDING_OPTIONS, OCCASIONS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 1, label: 'Client Info', icon: Building2 },
  { id: 2, label: 'Quantity & Budget', icon: Package },
  { id: 3, label: 'Branding', icon: Palette },
  { id: 4, label: 'Timeline', icon: Clock },
  { id: 5, label: 'Review', icon: Eye },
];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-between md:justify-start md:gap-0 w-full mb-8">
      {STEPS.map((step, i) => {
        const done = step.id < current;
        const active = step.id === current;
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${done ? 'bg-brand-600 border-brand-600 text-white' : active ? 'border-brand-500 text-brand-400 bg-brand-900/30' : 'border-surface-600 text-surface-500'}`}>
                {done ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`hidden md:block text-xs font-medium ${active ? 'text-brand-400' : done ? 'text-surface-300' : 'text-surface-600'}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`hidden md:block h-0.5 w-16 lg:w-24 mx-2 transition-all duration-300 ${done ? 'bg-brand-600' : 'bg-surface-700'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ProposalWizard() {
  const { addProposal, showToast } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    clientName: '', clientType: '', contactPerson: '', contactEmail: '',
    quantity: 100, budget: 100000,
    brandingReqs: [], customBranding: '', occasion: '',
    deliveryTimeline: '', notes: '',
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      const newProposal = {
        id: `PRO-${String(Date.now()).slice(-3)}`,
        ...form,
        status: 'AI-Processing',
        priority: form.budget > 200000 ? 'High' : form.budget > 80000 ? 'Medium' : 'Low',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiRecommendations: [],
        costSummary: { productCost: 0, brandingCost: 0, packagingCost: 0, logisticsCost: 0, total: form.budget },
        systemAlerts: [{ type: 'info', message: 'AI engine processing recommendations…', time: new Date().toISOString() }],
        actionHistory: [
          { id: 1, actor: 'Wizard', action: 'Proposal created via AI Wizard', timestamp: new Date().toISOString(), status: 'Draft' },
          { id: 2, actor: 'AI Engine', action: 'Started AI recommendation processing', timestamp: new Date().toISOString(), status: 'AI-Processing' },
        ],
      };
      addProposal(newProposal);
      showToast('🎉 Proposal created! AI is now generating recommendations.', 'success');
      setTimeout(() => navigate('/proposals'), 1000);
    }, 1500);
  };

  const canNext = () => {
    if (step === 1) return form.clientName && form.clientType;
    if (step === 2) return form.quantity > 0 && form.budget > 0;
    if (step === 3) return form.brandingReqs.length > 0 || form.occasion;
    if (step === 4) return form.deliveryTimeline;
    return true;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator current={step} />

      <div className="bg-surface-800 border border-surface-700/50 rounded-2xl p-6">
        {/* Step 1: Client Info */}
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-brand-400" />
              <h2 className="text-surface-100 font-semibold">Client Information</h2>
            </div>
            <TextInput label="Client / Company Name" id="clientName" value={form.clientName} onChange={e => update('clientName', e.target.value)} placeholder="e.g. TechNova Solutions" required />
            <SelectInput label="Client Type / Industry" id="clientType" options={CLIENT_TYPES} value={form.clientType} onChange={e => update('clientType', e.target.value)} required />
            <TextInput label="Contact Person" id="contactPerson" value={form.contactPerson} onChange={e => update('contactPerson', e.target.value)} placeholder="e.g. Priya Sharma" />
            <TextInput label="Contact Email" id="contactEmail" type="email" value={form.contactEmail} onChange={e => update('contactEmail', e.target.value)} placeholder="priya@company.com" />
          </div>
        )}

        {/* Step 2: Quantity & Budget */}
        {step === 2 && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-brand-400" />
              <h2 className="text-surface-100 font-semibold">Quantity & Budget</h2>
            </div>
            <TextInput label="Gift Quantity (units)" id="qty" type="number" min="1" value={form.quantity} onChange={e => update('quantity', parseInt(e.target.value) || 0)} />
            <RangeSlider
              label="Total Budget"
              id="budget"
              min={10000}
              max={1000000}
              value={form.budget}
              onChange={e => update('budget', parseInt(e.target.value))}
              formatValue={(v) => formatCurrency(v)}
            />
            <div className="bg-surface-900/50 rounded-xl p-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-surface-500 text-xs">Per Unit Budget</p>
                <p className="text-brand-400 font-bold">{formatCurrency(Math.round(form.budget / (form.quantity || 1)))}</p>
              </div>
              <div>
                <p className="text-surface-500 text-xs">Total Quantity</p>
                <p className="text-surface-100 font-bold">{form.quantity.toLocaleString()} units</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Branding */}
        {step === 3 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-5 h-5 text-brand-400" />
              <h2 className="text-surface-100 font-semibold">Branding Requirements</h2>
            </div>
            <SelectInput label="Occasion" id="occasion" options={OCCASIONS} value={form.occasion} onChange={e => update('occasion', e.target.value)} />
            <MultiSelect label="Branding Techniques" options={BRANDING_OPTIONS} selected={form.brandingReqs} onChange={val => update('brandingReqs', val)} />
            <TextArea label="Additional Branding Notes" id="customBranding" value={form.customBranding} onChange={e => update('customBranding', e.target.value)} placeholder="Any special requirements, brand guidelines, color codes..." rows={3} />
          </div>
        )}

        {/* Step 4: Timeline */}
        {step === 4 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-brand-400" />
              <h2 className="text-surface-100 font-semibold">Delivery Timeline</h2>
            </div>
            <TextInput label="Required Delivery Date" id="deliveryTimeline" type="date" value={form.deliveryTimeline} onChange={e => update('deliveryTimeline', e.target.value)} />
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { label: 'Express', days: 7, color: 'border-rose-500/50 text-rose-300' },
                { label: 'Standard', days: 21, color: 'border-amber-500/50 text-amber-300' },
                { label: 'Relaxed', days: 45, color: 'border-emerald-500/50 text-emerald-300' },
              ].map(opt => {
                const d = new Date(); d.setDate(d.getDate() + opt.days);
                const val = d.toISOString().split('T')[0];
                return (
                  <button
                    key={opt.label}
                    onClick={() => update('deliveryTimeline', val)}
                    className={`p-3 rounded-xl border text-center transition-all ${form.deliveryTimeline === val ? `${opt.color} bg-surface-700` : 'border-surface-700 text-surface-400 hover:border-surface-500'}`}
                  >
                    <p className="font-semibold text-sm">{opt.label}</p>
                    <p className="text-xs mt-0.5 opacity-70">{opt.days} days</p>
                  </button>
                );
              })}
            </div>
            <TextArea label="Delivery Notes" id="notes" value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Special delivery instructions, address, contact..." rows={3} />
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-brand-400" />
              <h2 className="text-surface-100 font-semibold">Review & Submit</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Client', value: form.clientName || '—' },
                { label: 'Industry', value: form.clientType || '—' },
                { label: 'Contact', value: form.contactPerson || '—' },
                { label: 'Email', value: form.contactEmail || '—' },
                { label: 'Quantity', value: `${form.quantity.toLocaleString()} units` },
                { label: 'Budget', value: formatCurrency(form.budget) },
                { label: 'Occasion', value: form.occasion || '—' },
                { label: 'Delivery', value: form.deliveryTimeline || '—' },
              ].map(item => (
                <div key={item.label} className="bg-surface-900/50 rounded-xl px-3 py-2.5">
                  <p className="text-surface-500 text-xs">{item.label}</p>
                  <p className="text-surface-100 text-sm font-medium mt-0.5 truncate">{item.value}</p>
                </div>
              ))}
            </div>
            {form.brandingReqs.length > 0 && (
              <div className="bg-surface-900/50 rounded-xl px-3 py-2.5">
                <p className="text-surface-500 text-xs mb-2">Branding Requirements</p>
                <div className="flex flex-wrap gap-1.5">
                  {form.brandingReqs.map(b => (
                    <span key={b} className="bg-brand-900/40 text-brand-300 border border-brand-500/30 text-xs px-2 py-0.5 rounded-md">{b}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-4 bg-brand-900/20 border border-brand-500/30 rounded-xl">
              <Sparkles className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-brand-300 font-semibold text-sm">AI Processing</p>
                <p className="text-brand-400/70 text-xs mt-0.5">After submission, our AI engine will analyze your requirements and generate curated product recommendations within minutes.</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-surface-700/40">
          <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 1}>
            ← Back
          </Button>
          <div className="flex items-center gap-2">
            {STEPS.map(s => (
              <div key={s.id} className={`w-1.5 h-1.5 rounded-full transition-all ${s.id === step ? 'bg-brand-400 w-4' : s.id < step ? 'bg-brand-600' : 'bg-surface-600'}`} />
            ))}
          </div>
          {step < 5 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={submitting} icon={Sparkles}>
              {submitting ? 'Creating…' : 'Generate AI Proposal'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
