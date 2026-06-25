import { useState } from 'react';
import { Package, AlertTriangle, CheckCircle, TrendingDown, Bell, BellOff, RefreshCw, ShoppingCart, Info, Zap } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Tooltip from '../../components/common/Tooltip';
import { useApp } from '../../context/AppContext';

const INVENTORY_DATA = [
  { id: 'INV-001', name: 'Premium Leather Notebook Set', emoji: '📓', category: 'Stationery', sku: 'PLN-A5-BLK', unitPrice: 1800, stockLevel: 820, totalCapacity: 1000, myUsualOrder: 500, reserved: 200, status: 'healthy', trend: 'stable', lastOrdered: '2026-05-20', leadTime: '7 days' },
  { id: 'INV-002', name: 'Crystal Desk Organizer', emoji: '💎', category: 'Office', sku: 'CDO-CLR-M', unitPrice: 2200, stockLevel: 180, totalCapacity: 500, myUsualOrder: 200, reserved: 150, status: 'critical', trend: 'falling', lastOrdered: '2026-06-01', leadTime: '14 days' },
  { id: 'INV-003', name: 'Smart Wireless Charger Pad', emoji: '⚡', category: 'Electronics', sku: 'SWC-15W-BLK', unitPrice: 1500, stockLevel: 340, totalCapacity: 600, myUsualOrder: 250, reserved: 100, status: 'low', trend: 'falling', lastOrdered: '2026-06-05', leadTime: '10 days' },
  { id: 'INV-004', name: 'Artisan Chocolate Gift Box', emoji: '🍫', category: 'Food & Beverage', sku: 'ACB-16-BLG', unitPrice: 800, stockLevel: 650, totalCapacity: 800, myUsualOrder: 400, reserved: 50, status: 'healthy', trend: 'stable', lastOrdered: '2026-06-10', leadTime: '3 days' },
  { id: 'INV-005', name: 'Bamboo Eco Kit', emoji: '🌿', category: 'Eco-Friendly', sku: 'BEK-STD-GRN', unitPrice: 950, stockLevel: 120, totalCapacity: 700, myUsualOrder: 300, reserved: 100, status: 'critical', trend: 'falling', lastOrdered: '2026-05-28', leadTime: '12 days' },
  { id: 'INV-006', name: 'Custom Tote Bag Collection', emoji: '👜', category: 'Apparel', sku: 'CTB-10OZ-NAT', unitPrice: 450, stockLevel: 480, totalCapacity: 600, myUsualOrder: 300, reserved: 0, status: 'healthy', trend: 'rising', lastOrdered: '2026-06-08', leadTime: '5 days' },
  { id: 'INV-007', name: 'Premium Gift Hamper Set', emoji: '🎁', category: 'Hampers', sku: 'PGH-DLX-CANE', unitPrice: 5500, stockLevel: 35, totalCapacity: 200, myUsualOrder: 50, reserved: 30, status: 'critical', trend: 'falling', lastOrdered: '2026-06-03', leadTime: '21 days' },
  { id: 'INV-008', name: 'Smart Water Bottle', emoji: '💧', category: 'Lifestyle', sku: 'SWB-500ML-SS', unitPrice: 1200, stockLevel: 290, totalCapacity: 400, myUsualOrder: 150, reserved: 80, status: 'low', trend: 'stable', lastOrdered: '2026-06-07', leadTime: '7 days' },
];

const statusConfig = {
  healthy: { label: 'In Stock', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', bar: 'bg-emerald-500', icon: CheckCircle },
  low: { label: 'Low Stock', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', bar: 'bg-amber-500', icon: AlertTriangle },
  critical: { label: 'Critical', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', bar: 'bg-rose-500', icon: AlertTriangle },
};

export default function InventoryScreen() {
  const { showToast } = useApp();
  const [alerts, setAlerts] = useState(new Set(['INV-002', 'INV-005', 'INV-007']));
  const [reordering, setReordering] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const toggleAlert = (id) => {
    setAlerts(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const handleReorder = (item) => {
    setReordering(item.id);
    setTimeout(() => {
      setReordering(null);
      showToast(`Reorder request for ${item.myUsualOrder} units of "${item.name}" sent to procurement!`, 'success');
    }, 1800);
  };

  const filtered = filterStatus === 'All' ? INVENTORY_DATA : INVENTORY_DATA.filter(i => i.status === filterStatus);
  const criticalCount = INVENTORY_DATA.filter(i => i.status === 'critical').length;
  const lowCount = INVENTORY_DATA.filter(i => i.status === 'low').length;
  const available = (item) => Math.max(0, item.stockLevel - item.reserved);
  const canFulfill = (item) => available(item) >= item.myUsualOrder;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Inventory Screen</h1>
          <p className="text-surface-400 text-sm mt-1">Real-time stock levels for your frequently ordered items</p>
        </div>
        <div className="flex gap-2 md:ml-auto">
          <Tooltip content="Feature requires backend integration" position="left">
            <Button variant="ghost" disabled icon={RefreshCw}>Live Sync</Button>
          </Tooltip>
        </div>
      </div>

      {/* Alert Banner */}
      {(criticalCount > 0 || lowCount > 0) && (
        <div className="bg-[#ffffff] border border-[#000000] rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-rose-600 font-semibold text-sm">Stock Alerts Active</p>
            <p className="text-rose-800 text-xs mt-0.5">
              {criticalCount} item{criticalCount !== 1 ? 's' : ''} critically low &nbsp;·&nbsp; {lowCount} item{lowCount !== 1 ? 's' : ''} below threshold. Consider placing reorders to avoid fulfillment delays.
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Items Tracked', value: INVENTORY_DATA.length, icon: Package, color: 'bg-brand-50 border border-brand-100 text-brand-700' },
          { label: 'In Stock', value: INVENTORY_DATA.filter(i => i.status === 'healthy').length, icon: CheckCircle, color: 'bg-emerald-50 border border-emerald-100 text-emerald-700' },
          { label: 'Low Stock', value: lowCount, icon: TrendingDown, color: 'bg-amber-50 border border-amber-100 text-amber-700' },
          { label: 'Critical', value: criticalCount, icon: AlertTriangle, color: 'bg-rose-50 border border-rose-100 text-rose-700' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-surface-800 border border-surface-700/50 rounded-xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}><Icon className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold text-surface-100">{card.value}</p><p className="text-surface-500 text-xs">{card.label}</p></div>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {['All', 'healthy', 'low', 'critical'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border capitalize transition-all ${filterStatus === s ? 'bg-brand-600 text-white border-brand-500' : 'bg-surface-800 text-surface-400 border-surface-700 hover:border-brand-500/40'}`}>
            {s === 'healthy' ? 'In Stock' : s === 'critical' ? 'Critical' : s === 'low' ? 'Low Stock' : s}
          </button>
        ))}
      </div>

      {/* Inventory List */}
      <div className="flex flex-col gap-3">
        {filtered.map(item => {
          const cfg = statusConfig[item.status];
          const StatusIcon = cfg.icon;
          const stockPct = Math.round((item.stockLevel / item.totalCapacity) * 100);
          const availableUnits = available(item);
          const canFill = canFulfill(item);
          const alertOn = alerts.has(item.id);

          return (
            <div key={item.id} className={`bg-surface-800 border rounded-2xl p-4 transition-all ${item.status === 'critical' ? 'border-rose-700/30' : item.status === 'low' ? 'border-amber-700/30' : 'border-surface-700/50'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Product */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-surface-700/50 border border-surface-600/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{item.emoji}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-surface-100 font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-surface-500 text-xs">{item.sku} · {item.category}</p>
                    <p className="text-surface-600 text-xs">Lead time: {item.leadTime} · Last ordered: {item.lastOrdered}</p>
                  </div>
                </div>

                {/* Stock Bar */}
                <div className="flex-1 min-w-0 sm:max-w-[200px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-surface-400">{item.stockLevel.toLocaleString()} / {item.totalCapacity.toLocaleString()}</span>
                    <span className={`text-xs font-bold ${item.status === 'critical' ? 'text-rose-400' : item.status === 'low' ? 'text-amber-400' : 'text-emerald-400'}`}>{stockPct}%</span>
                  </div>
                  <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
                    <div className={`h-full ${cfg.bar} rounded-full transition-all duration-700`} style={{ width: `${stockPct}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-surface-600">Reserved: {item.reserved}</span>
                    <span className={`text-[10px] font-medium ${canFill ? 'text-emerald-400' : 'text-rose-400'}`}>{canFill ? `✓ Can fulfill ${item.myUsualOrder} units` : `✗ Short by ${item.myUsualOrder - availableUnits} units`}</span>
                  </div>
                </div>

                {/* Status + Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                    <StatusIcon className="w-3 h-3" /> {cfg.label}
                  </span>
                  <button onClick={() => toggleAlert(item.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${alertOn ? 'bg-brand-600/20 text-brand-400' : 'bg-surface-700/50 text-surface-500 hover:text-surface-300'}`} title={alertOn ? 'Alerts ON' : 'Enable alerts'}>
                    {alertOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>
                  <Button variant={item.status === 'critical' ? 'danger' : 'secondary'} size="sm" icon={ShoppingCart} loading={reordering === item.id} onClick={() => handleReorder(item)}>
                    Reorder
                  </Button>
                </div>
              </div>

              {/* Unit pricing */}
              <div className="mt-3 pt-3 border-t border-surface-700/30 flex flex-wrap gap-4 text-xs">
                <div><span className="text-surface-500">Unit Price: </span><span className="text-brand-400 font-semibold">{formatCurrency(item.unitPrice)}</span></div>
                <div><span className="text-surface-500">Your usual order: </span><span className="text-surface-300 font-medium">{item.myUsualOrder.toLocaleString()} units</span></div>
                <div><span className="text-surface-500">Estimated cost: </span><span className="text-surface-300 font-medium">{formatCurrency(item.unitPrice * item.myUsualOrder)}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
