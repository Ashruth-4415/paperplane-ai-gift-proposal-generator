import { useNavigate } from 'react-router-dom';
import { ArrowRight, Gift, Sparkles, Send, CheckSquare, Layers, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { activeUser, tickets, orderedItems, rateOrderedItem, showToast } = useApp();
  const recentTickets = (tickets || []).slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Hero Landing Section (Matching Screenshot Structure) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 md:pt-8">
        
        {/* Left Content (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full text-brand-400 text-xs font-bold uppercase tracking-wider">
            <span>Corporate Collection 2026-27</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-surface-50 leading-tight tracking-tight">
            Empowering Brands, <br/>
            <span className="bg-gradient-to-r from-brand-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Shaping Connections
            </span>
          </h1>

          <p className="text-surface-400 text-base md:text-lg leading-relaxed max-w-xl">
            Join PaperPlane AI Proposals, where custom brand elegance meets automated curation. 
            Secure your custom corporate gifting experience with our proven track record of premium designs.
          </p>

          <div className="pt-2">
            <button
              onClick={() => navigate('/customer/store')}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-sm md:text-base shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-200 group"
            >
              <span>Explore Gift Store Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Content (5 cols) - Live Corporate Enquiry Tracker */}
        <div className="lg:col-span-5 flex justify-center">
          <div 
            onClick={() => navigate('/customer/enquiries')}
            className="relative w-full max-w-md bg-surface-900/60 border border-surface-800 rounded-3xl p-6 shadow-2xl overflow-hidden hover:border-brand-500/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            {/* Glowing background decor */}
            <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-brand-500/10 blur-[60px] pointer-events-none" />
            
            {/* Live Status Tracker Box */}
            <div className="aspect-[4/3] bg-gradient-to-br from-surface-950 to-surface-900 border border-surface-800 rounded-2xl flex flex-col justify-between p-5 relative shadow-inner">
              <div className="flex justify-between items-center pb-2 border-b border-surface-800/80">
                <span className="text-[10px] uppercase tracking-widest font-bold text-surface-400">Active Enquiries</span>
                <span className="text-[9px] px-2 py-0.5 bg-brand-950 border border-brand-800 rounded text-brand-400 font-medium">Live Updates</span>
              </div>

              {/* Tickets List */}
              <div className="flex-1 py-3 overflow-y-auto space-y-3 divide-y divide-surface-800/40 no-scrollbar">
                {recentTickets.map((ticket, index) => {
                  const statusColors = {
                    'Open': 'text-amber-400 bg-amber-400/10 border-amber-500/20',
                    'In Progress': 'text-blue-400 bg-blue-400/10 border-blue-500/20',
                    'Resolved': 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20',
                    'Closed': 'text-surface-400 bg-surface-500/10 border-surface-600/20',
                  };
                  const statusClass = statusColors[ticket.status] || 'text-surface-400 bg-surface-500/10 border-surface-600/20';

                  return (
                    <div key={ticket.id} className={`flex justify-between items-start pt-3 ${index === 0 ? 'pt-0' : ''}`}>
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-surface-200 truncate">{ticket.subject}</p>
                        <p className="text-[10px] text-surface-500 font-mono mt-0.5">{ticket.id} • {ticket.type}</p>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 border rounded-full font-medium flex-shrink-0 ${statusClass}`}>
                        {ticket.status}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-xs text-surface-400 border-t border-surface-800/80 pt-2.5">
                <p className="font-semibold text-surface-300">Total Enquiries</p>
                <p className="text-xs font-bold text-brand-400">{tickets?.length || 0} Submitted</p>
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <h4 className="text-sm font-bold text-surface-200">Corporate Enquiry Tracker</h4>
              <p className="text-xs text-surface-500">Real-time status updates and proposal tracking logs.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Recently Ordered Gifts & Ratings (Phase 35) */}
      <div className="border-t border-surface-800/60 pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
          <div>
            <h3 className="text-xs font-bold text-surface-500 uppercase tracking-widest">Ordered Gifts Feedback</h3>
            <h2 className="text-lg font-bold text-surface-100 mt-1">Rate Your Recently Delivered Items</h2>
          </div>
          <span className="text-xs text-[#000000] bg-[#ffffff] border border-[#000000] px-3 py-1.5 rounded-full font-semibold select-none">
            Ordered items: {orderedItems?.length || 0}
          </span>
        </div>

        {(!orderedItems || orderedItems.length === 0) ? (
          <div className="flex flex-col items-center justify-center p-8 bg-[#ffffff] border border-slate-900 rounded-2xl text-center shadow-sm">
            <Gift className="w-10 h-10 text-slate-400 mb-2 animate-bounce" />
            <p className="text-sm text-slate-500 font-medium">No order history found yet.</p>
            <p className="text-xs text-slate-400 mt-1">Place orders in the Online Gift Order page to rate them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderedItems.map(item => (
              <div 
                key={item.id} 
                className="relative bg-[#ffffff] border border-slate-900 rounded-[20px] p-5 shadow-sm flex gap-4 hover:shadow-md hover:border-brand-400 transition-all duration-300 group"
              >
                {/* Product Illustration area */}
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center relative overflow-hidden flex-shrink-0 select-none border border-slate-100">
                  <div className="absolute w-10 h-10 rounded-full bg-brand-500/10 blur-md group-hover:scale-125 transition-transform duration-300" />
                  <span className="text-3xl z-10">{item.emoji}</span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-brand-600 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                      Ordered: {item.qty} Units • {item.orderDate}
                    </p>
                  </div>

                  {/* Interactive Star Rating */}
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isFilled = val <= item.rating;
                      return (
                        <button
                          key={val}
                          onClick={() => {
                            rateOrderedItem(item.id, val);
                            showToast(`Thank you for rating "${item.name}" ${val} stars!`, 'success');
                          }}
                          className="focus:outline-none transition-transform active:scale-135 hover:scale-120 p-0.5"
                          title={`Rate ${val} Stars`}
                        >
                          <Star
                            className={`w-4 h-4 transition-all duration-200 ${
                              isFilled 
                                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]' 
                                : 'text-slate-600 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                    {item.rating > 0 && (
                      <span className="text-[9px] font-extrabold text-amber-400 ml-1.5 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {item.rating}/5
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Access Portal Grid */}
      <div className="border-t border-surface-800/60 pt-10">
        <h3 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-6">Quick Portal Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div onClick={() => navigate('/customer/custom-form')} className="p-5 bg-surface-900/40 border border-surface-800 rounded-2xl hover:border-brand-500/40 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-surface-200 mb-1">Custom Proposals</h4>
            <p className="text-xs text-surface-500">Request a specialized AI curated proposal for your occasion.</p>
          </div>

          <div onClick={() => navigate('/customer/personalize')} className="p-5 bg-surface-900/40 border border-surface-800 rounded-2xl hover:border-brand-500/40 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
              <Send className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-surface-200 mb-1">Branding Hub</h4>
            <p className="text-xs text-surface-500">Upload vector files and select target branding techniques.</p>
          </div>

          <div onClick={() => navigate('/customer/design-approvals')} className="p-5 bg-surface-900/40 border border-surface-800 rounded-2xl hover:border-brand-500/40 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-surface-200 mb-1">Mockup Approvals</h4>
            <p className="text-xs text-surface-500">Approve designs for production or write modification notes.</p>
          </div>

          <div onClick={() => navigate('/customer/inventory')} className="p-5 bg-surface-900/40 border border-surface-800 rounded-2xl hover:border-brand-500/40 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-surface-200 mb-1">Supply Inventory</h4>
            <p className="text-xs text-surface-500">Track current stock availability and trigger restock requests.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
