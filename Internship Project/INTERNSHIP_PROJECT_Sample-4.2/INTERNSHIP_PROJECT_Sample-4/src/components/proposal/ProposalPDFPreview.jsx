import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function ProposalPDFPreview({ proposal }) {
  if (!proposal) return null;
  const { costSummary: cs } = proposal;

  return (
    <div 
      id="pdf-content" 
      className="p-10 mx-auto rounded-2xl" 
      style={{ 
        width: '800px', 
        minHeight: '1131px', 
        position: 'relative', 
        backgroundColor: '#ffffff', 
        color: '#1e293b',
        border: '3px solid #0f172a',
        fontFamily: "Arial, Helvetica, sans-serif",
        fontVariantLigatures: 'none',
        WebkitFontVariantLigatures: 'none',
        letterSpacing: '0.2px',
        wordSpacing: '1px'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start pb-6 mb-8" style={{ borderBottom: '3px solid #0284c7' }}>
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2" style={{ color: '#0284c7' }}>PaperPlane</h1>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Corporate Gifting Solutions</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold mb-1" style={{ color: '#1e293b' }}>PROPOSAL</h2>
          <p className="text-sm font-mono" style={{ color: '#64748b' }}>{proposal.id}</p>
          <p className="text-sm mt-2" style={{ color: '#64748b' }}>Date: {formatDate(new Date().toISOString())}</p>
        </div>
      </div>

      {/* Client Info */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl p-5" style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1.5" style={{ color: '#64748b', borderBottom: '1px solid #cbd5e1' }}>Prepared For</h3>
          <p className="text-lg font-bold mb-2" style={{ color: '#1e293b' }}>{proposal.clientName}</p>
          <p className="text-sm mb-1" style={{ color: '#475569' }}><strong style={{ color: '#334155' }}>Contact:</strong> {proposal.contactPerson}</p>
          <p className="text-sm mb-1" style={{ color: '#475569' }}><strong style={{ color: '#334155' }}>Email:</strong> {proposal.contactEmail}</p>
          <p className="text-sm mt-2 font-medium" style={{ color: '#64748b' }}>{proposal.clientType} Industry</p>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1.5" style={{ color: '#64748b', borderBottom: '1px solid #cbd5e1' }}>Project Details</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="py-1" style={{ color: '#64748b' }}>Occasion</td><td className="py-1 font-semibold text-right" style={{ color: '#1e293b' }}>{proposal.occasion}</td></tr>
              <tr><td className="py-1" style={{ color: '#64748b' }}>Target Quantity</td><td className="py-1 font-semibold text-right" style={{ color: '#1e293b' }}>{proposal.quantity?.toLocaleString()} units</td></tr>
              <tr><td className="py-1" style={{ color: '#64748b' }}>Budget Per Unit</td><td className="py-1 font-semibold text-right" style={{ color: '#1e293b' }}>{formatCurrency(proposal.budget)}</td></tr>
              <tr><td className="py-1" style={{ color: '#64748b' }}>Delivery Target</td><td className="py-1 font-semibold text-right" style={{ color: '#1e293b' }}>{formatDate(proposal.deliveryTimeline)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Branding Reqs */}
      {proposal.brandingReqs && proposal.brandingReqs.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider pb-2 mb-4" style={{ color: '#0284c7', borderBottom: '1px solid #cbd5e1' }}>Branding Specifications</h3>
          <div className="flex flex-wrap gap-2">
            {proposal.brandingReqs.map(req => (
              <span key={req} className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>✓ {req}</span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="mb-8">
        <h3 className="text-sm font-bold uppercase tracking-wider pb-2 mb-4" style={{ color: '#0284c7', borderBottom: '1px solid #cbd5e1' }}>Curated Recommendations</h3>
        {proposal.aiRecommendations && proposal.aiRecommendations.length > 0 ? (
          <div className="flex flex-col gap-4">
            {proposal.aiRecommendations.map(rec => (
              <div key={rec.id} className="rounded-xl p-5" style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold" style={{ color: '#1e293b' }}>{rec.product}</h4>
                  <div className="text-right">
                    <span className="text-lg font-black" style={{ color: '#0284c7' }}>{formatCurrency(rec.price)}</span>
                    <span className="text-xs block" style={{ color: '#64748b' }}>per unit</span>
                  </div>
                </div>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: '#475569' }}>{rec.reason}</p>
                <div className="flex items-center gap-4 text-xs font-semibold" style={{ color: '#64748b' }}>
                  <span className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1' }}>Category: {rec.category || 'General'}</span>
                  <span className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1' }}>Match Score: {rec.score}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm italic" style={{ color: '#64748b' }}>Recommendations are currently being finalized by our AI engine.</p>
        )}
      </div>

      {/* Cost Breakdown */}
      <div className="mt-6 mb-20">
        <h3 className="text-sm font-bold uppercase tracking-wider pb-2 mb-4" style={{ color: '#0284c7', borderBottom: '1px solid #cbd5e1' }}>Estimated Cost Summary</h3>
        <div className="rounded-xl p-6" style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}>
          {proposal.aiRecommendations && proposal.aiRecommendations.length > 0 && (
            <div className="flex justify-between items-start mb-4 pb-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <span className="text-sm font-semibold mt-1" style={{ color: '#64748b' }}>Items Breakdown</span>
              <div className="text-right">
                {proposal.aiRecommendations.map(rec => (
                  <div key={rec.id} className="text-sm mb-1" style={{ color: '#475569' }}>
                    {rec.quantity || proposal.quantity}x {rec.product} <span style={{ color: '#94a3b8' }}>@ {formatCurrency(rec.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold" style={{ color: '#1e293b' }}>Total Investment</span>
            <span className="text-2xl font-black" style={{ color: '#0284c7' }}>
              {formatCurrency(
                proposal.aiRecommendations && proposal.aiRecommendations.length > 0
                  ? proposal.aiRecommendations.reduce((sum, rec) => sum + ((rec.price || 0) * (rec.quantity || proposal.quantity || 0)), 0)
                  : (cs?.total ?? 0)
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-10 left-10 right-10 pt-6" style={{ borderTop: '1px solid #cbd5e1' }}>
        <div className="flex justify-between items-center text-xs" style={{ color: '#94a3b8' }}>
          <p>Generated by PaperPlane AI Engine</p>
          <p>Confidential & Proprietary • Valid for 30 days</p>
        </div>
      </div>
    </div>
  );
}
