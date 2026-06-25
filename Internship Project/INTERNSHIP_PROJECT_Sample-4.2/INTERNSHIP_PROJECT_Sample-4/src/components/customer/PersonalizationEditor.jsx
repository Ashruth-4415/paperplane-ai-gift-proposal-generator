import { useState } from 'react';
import { Upload, CheckCircle, XCircle, Eye, Palette, Package } from 'lucide-react';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';

const mockMockups = [
  { id: 1, name: 'Corporate Notebook — Front', approved: null, emoji: '📓', color: 'from-amber-800/60 to-amber-700/30' },
  { id: 2, name: 'Crystal Organizer — Engraved', approved: null, emoji: '💎', color: 'from-blue-800/60 to-blue-700/30' },
  { id: 3, name: 'Wireless Charger — Pad Print', approved: null, emoji: '⚡', color: 'from-violet-800/60 to-violet-700/30' },
];

export default function PersonalizationEditor() {
  const { showToast } = useApp();
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [logoName, setLogoName] = useState('');
  const [brandColors, setBrandColors] = useState(['#4f46e5', '#10b981']);
  const [mockups, setMockups] = useState(mockMockups);
  const [loading, setLoading] = useState(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoName(file.name);
      setLogoUploaded(true);
      showToast('Logo uploaded successfully!', 'success');
    }
  };

  const handleDecision = (id, approved) => {
    setLoading(id);
    setTimeout(() => {
      setMockups(prev => prev.map(m => m.id === id ? { ...m, approved } : m));
      setLoading(null);
      showToast(approved ? 'Mockup approved! ✓' : 'Mockup rejected — designer notified.', approved ? 'success' : 'error');
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Logo Upload */}
      <div className="bg-surface-800 border border-surface-700/50 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-brand-600/20 flex items-center justify-center">
            <Palette className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h3 className="text-surface-100 font-semibold text-sm">Brand Assets</h3>
            <p className="text-surface-500 text-xs">Upload your logo and define brand colors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Logo Upload */}
          <label className={`relative flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${logoUploaded ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-surface-600 hover:border-brand-500/50 hover:bg-brand-900/10'}`}>
            <input type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} />
            {logoUploaded ? (
              <>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
                <p className="text-emerald-300 text-sm font-medium">Logo Uploaded</p>
                <p className="text-surface-500 text-xs truncate max-w-full">{logoName}</p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-surface-400" />
                </div>
                <p className="text-surface-300 text-sm font-medium">Upload Logo</p>
                <p className="text-surface-500 text-xs text-center">SVG, PNG or JPG (max 5MB)</p>
              </>
            )}
          </label>

          {/* Brand Colors */}
          <div className="p-4 bg-surface-900/50 rounded-xl">
            <p className="text-surface-400 text-xs font-medium mb-3 uppercase tracking-wider">Brand Colors</p>
            <div className="flex flex-col gap-3">
              {brandColors.map((color, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg border-2 border-surface-600 flex-shrink-0" style={{ backgroundColor: color }} />
                  <input
                    type="color"
                    value={color}
                    onChange={e => { const nc = [...brandColors]; nc[i] = e.target.value; setBrandColors(nc); }}
                    className="w-24 h-8 rounded-lg cursor-pointer bg-transparent border-0 outline-none"
                  />
                  <span className="text-surface-500 text-xs font-mono">{color}</span>
                </div>
              ))}
              <button
                onClick={() => setBrandColors([...brandColors, '#000000'])}
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors text-left"
              >
                + Add color
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mockup Approval */}
      <div className="bg-surface-800 border border-surface-700/50 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-amber-600/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-surface-100 font-semibold text-sm">Design Mockups</h3>
            <p className="text-surface-500 text-xs">Review and approve or reject each design mockup</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockups.map(mockup => (
            <div key={mockup.id} className={`rounded-xl border overflow-hidden transition-all ${mockup.approved === true ? 'border-emerald-500/50' : mockup.approved === false ? 'border-rose-500/50' : 'border-surface-700/50'}`}>
              {/* Preview */}
              <div className={`h-32 bg-gradient-to-br ${mockup.color} flex flex-col items-center justify-center gap-2`}>
                <span className="text-4xl">{mockup.emoji}</span>
                {logoUploaded && (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded px-2 py-0.5">
                    <span className="text-white text-xs font-bold">LOGO</span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-3 bg-surface-900/50">
                <p className="text-surface-200 text-xs font-medium mb-2">{mockup.name}</p>
                {mockup.approved === null ? (
                  <div className="flex gap-2">
                    <Button
                      variant="success"
                      size="xs"
                      loading={loading === mockup.id}
                      onClick={() => handleDecision(mockup.id, true)}
                      className="flex-1"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="xs"
                      loading={loading === mockup.id}
                      onClick={() => handleDecision(mockup.id, false)}
                      className="flex-1"
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${mockup.approved ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {mockup.approved ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {mockup.approved ? 'Approved' : 'Rejected'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
