import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Filter, Search, Download, Kanban, List, ShoppingCart, CheckCircle, XCircle, Truck, Package, Clock } from 'lucide-react';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ApprovalBoard from '../../components/proposal/ApprovalBoard';
import { useApp } from '../../context/AppContext';
import { formatDate, formatCurrency } from '../../utils/formatters';
import Modal from '../../components/common/Modal';
import { PROPOSAL_STATUSES } from '../../utils/constants';

const ALL_STATUSES = ['All', ...Object.values(PROPOSAL_STATUSES)];
const ORDER_STATUSES = ['All', 'Pending', 'Approved & Packing', 'Rejected', 'Shipped'];

export default function ProposalDashboard() {
  const { proposals, orders, updateOrderStatus, addNotification, showToast } = useApp();
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState('proposals'); // 'proposals' | 'orders'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [view, setView] = useState('table');
  const [exportModal, setExportModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filteredProposals = proposals.filter(p => {
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchSearch = !search || p.clientName.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filteredOrders = (orders || []).filter(o => {
    const matchStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    const matchSearch = !search || 
      o.customerName.toLowerCase().includes(search.toLowerCase()) || 
      o.companyName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => { setExporting(false); setExportModal(false); showToast('Proposals exported successfully as CSV', 'success'); }, 1500);
  };

  const handleApproveOrder = (order) => {
    setActionLoading(true);
    setTimeout(() => {
      updateOrderStatus(order.id, 'Approved & Packing');
      
      addNotification({
        role: 'customer',
        type: 'reminder',
        message: `Order Approved: Your bulk order ${order.id} is approved and our production team is packing it.`,
        link: '/customer/dashboard',
        customerEmail: order.customerEmail,
        companyName: order.companyName
      });

      addNotification({
        role: 'admin',
        type: 'message',
        message: `Order Status: You approved and sent order ${order.id} (${order.companyName}) to packing.`,
        link: '/admin/orders'
      });

      showToast(`Order ${order.id} approved and sent to packing!`, 'success');
      setSelectedOrder(prev => prev ? { ...prev, status: 'Approved & Packing' } : null);
      setActionLoading(false);
    }, 600);
  };

  const handleRejectOrder = (order) => {
    setActionLoading(true);
    setTimeout(() => {
      updateOrderStatus(order.id, 'Rejected');

      addNotification({
        role: 'customer',
        type: 'alert',
        message: `Action Required: Your bulk order request ${order.id} was rejected. Please review details.`,
        link: '/customer/dashboard',
        customerEmail: order.customerEmail,
        companyName: order.companyName
      });

      addNotification({
        role: 'admin',
        type: 'alert',
        message: `Order Status: You rejected order request ${order.id} for ${order.companyName}.`,
        link: '/admin/orders'
      });

      showToast(`Order ${order.id} rejected.`, 'error');
      setSelectedOrder(prev => prev ? { ...prev, status: 'Rejected' } : null);
      setActionLoading(false);
    }, 600);
  };

  const handleShipOrder = (order) => {
    setActionLoading(true);
    setTimeout(() => {
      updateOrderStatus(order.id, 'Shipped');

      addNotification({
        role: 'customer',
        type: 'alert',
        message: `Order Shipped: Your bulk order ${order.id} has been shipped. Track your shipment.`,
        link: '/customer/dashboard',
        customerEmail: order.customerEmail,
        companyName: order.companyName
      });

      addNotification({
        role: 'admin',
        type: 'reminder',
        message: `Order Dispatch: Order ${order.id} for ${order.companyName} has been marked as shipped.`,
        link: '/admin/orders'
      });

      showToast(`Order ${order.id} marked as Shipped!`, 'success');
      setSelectedOrder(prev => prev ? { ...prev, status: 'Shipped' } : null);
      setActionLoading(false);
    }, 600);
  };

  const columns = [
    { key: 'id', label: 'ID', width: '100px', render: v => <span className="font-mono text-brand-400 text-xs">{v}</span> },
    { key: 'clientName', label: 'Client' },
    { key: 'clientType', label: 'Type', render: v => <span className="text-surface-400 text-xs">{v}</span> },
    { key: 'quantity', label: 'Qty', render: v => v?.toLocaleString() },
    { key: 'budget', label: 'Budget', render: v => <span className="text-brand-400 font-semibold">{formatCurrency(v)}</span> },
    { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
    { key: 'priority', label: 'Priority', render: v => <PriorityBadge priority={v} /> },
    { key: 'deliveryTimeline', label: 'Delivery', render: v => formatDate(v) },
    { key: 'updatedAt', label: 'Updated', render: v => formatDate(v) },
  ];

  const orderColumns = [
    { key: 'id', label: 'Order ID', width: '120px', render: v => <span className="font-mono text-brand-400 text-xs font-bold">{v}</span> },
    { key: 'customerName', label: 'Customer' },
    { key: 'companyName', label: 'Company', render: v => <span className="text-surface-400 text-xs">{v}</span> },
    { key: 'items', label: 'Items', render: items => {
        const itemNames = items.map(i => `${i.emoji || '🎁'} ${i.name} (x${i.qty})`).join(', ');
        return <span className="text-xs text-surface-300 truncate block max-w-[250px]" title={itemNames}>{itemNames}</span>;
      }
    },
    { key: 'total', label: 'Total Value', render: v => <span className="text-emerald-400 font-bold">{formatCurrency(v)}</span> },
    { key: 'orderDate', label: 'Order Date', render: v => <span className="text-surface-400 text-xs">{v}</span> },
    { key: 'status', label: 'Status', render: v => {
        let style = 'bg-slate-500/10 text-slate-400 border-slate-600/20';
        if (v === 'Pending') style = 'bg-amber-550/10 text-amber-400 border-amber-500/20';
        else if (v === 'Approved & Packing') style = 'bg-blue-550/10 text-blue-400 border-blue-500/20';
        else if (v === 'Rejected') style = 'bg-rose-550/10 text-rose-450 border-rose-600/20';
        else if (v === 'Shipped') style = 'bg-emerald-550/10 text-emerald-400 border-emerald-500/20';
        return <span className={`text-[10px] px-2.5 py-1 border rounded-full font-bold uppercase tracking-wider ${style}`}>{v}</span>;
      }
    },
  ];

  const statusCounts = ALL_STATUSES.slice(1).reduce((acc, s) => ({ ...acc, [s]: proposals.filter(p => p.status === s).length }), {});
  const orderStatusCounts = ORDER_STATUSES.slice(1).reduce((acc, s) => ({ ...acc, [s]: (orders || []).filter(o => o.status === s).length }), {});

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">
            {mainTab === 'proposals' ? 'Proposals' : 'Customer Orders'}
          </h1>
          <p className="text-surface-400 text-sm mt-1">
            {mainTab === 'proposals' 
              ? `${proposals.length} total proposals across all stages` 
              : `${(orders || []).length} total orders across all stages`}
          </p>
        </div>
        <div className="flex items-center gap-2 md:ml-auto">
          {mainTab === 'proposals' && (
            <Button variant="secondary" icon={Download} onClick={() => setExportModal(true)}>Export</Button>
          )}
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex bg-surface-900/60 border border-surface-700/60 p-1 rounded-xl self-start">
        <button
          onClick={() => {
            setMainTab('proposals');
            setSearch('');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            mainTab === 'proposals'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/10'
              : 'text-surface-400 hover:text-surface-200'
          }`}
        >
          Proposals
        </button>
        <button
          onClick={() => {
            setMainTab('orders');
            setSearch('');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            mainTab === 'orders'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/10'
              : 'text-surface-400 hover:text-surface-200'
          }`}
        >
          Customer Orders
        </button>
      </div>

      {/* Status pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {mainTab === 'proposals' ? (
          ALL_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${statusFilter === s ? 'bg-brand-600 text-white' : 'bg-surface-800 text-surface-400 border border-surface-700 hover:border-brand-500/40'}`}
            >
              {s}
              {s !== 'All' && <span className="bg-surface-700/60 text-surface-300 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{statusCounts[s] || 0}</span>}
            </button>
          ))
        ) : (
          ORDER_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setOrderStatusFilter(s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${orderStatusFilter === s ? 'bg-brand-600 text-white' : 'bg-surface-800 text-surface-400 border border-surface-700 hover:border-brand-500/40'}`}
            >
              {s}
              {s !== 'All' && <span className="bg-surface-700/60 text-surface-300 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{orderStatusCounts[s] || 0}</span>}
            </button>
          ))
        )}
      </div>

      {/* Search + View Toggle (View Toggle only for Proposals) */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 bg-surface-800 border border-surface-700 rounded-xl px-3 py-2 focus-within:border-brand-500 transition-colors">
          <Search className="w-4 h-4 text-surface-500 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={mainTab === 'proposals' ? "Search by client name or proposal ID..." : "Search by customer name, company, or order ID..."}
            className="flex-1 bg-transparent text-sm text-surface-200 placeholder-surface-500 outline-none"
          />
        </div>
        {mainTab === 'proposals' && (
          <div className="flex bg-surface-800 border border-surface-700 rounded-xl p-1 self-start">
            <button onClick={() => setView('table')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${view === 'table' ? 'bg-surface-700 text-surface-100' : 'text-surface-500 hover:text-surface-300'}`}>
              <List className="w-4 h-4" /> Table
            </button>
            <button onClick={() => setView('board')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${view === 'board' ? 'bg-surface-700 text-surface-100' : 'text-surface-500 hover:text-surface-300'}`}>
              <Kanban className="w-4 h-4" /> Board
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {mainTab === 'proposals' ? (
          view === 'table' ? (
            <Table
              columns={columns}
              data={filteredProposals}
              onRowClick={row => navigate(`/admin/proposals/${row.id}`)}
              emptyMessage="No proposals match your filters"
            />
          ) : (
            <ApprovalBoard proposals={filteredProposals} />
          )
        ) : (
          <Table
            columns={orderColumns}
            data={filteredOrders}
            onRowClick={row => setSelectedOrder(row)}
            emptyMessage="No customer orders match your filters"
          />
        )}
      </div>

      {/* Export Modal (Proposals Only) */}
      <Modal
        isOpen={exportModal}
        onClose={() => setExportModal(false)}
        title="Export Proposals"
        size="sm"
        footer={<><Button variant="ghost" onClick={() => setExportModal(false)}>Cancel</Button><Button loading={exporting} icon={Download} onClick={handleExport}>Export CSV</Button></>}
      >
        <div className="flex flex-col gap-4">
          <p className="text-surface-300 text-sm">Export {filteredProposals.length} proposal(s) as a CSV file.</p>
          <div className="flex flex-col gap-2">
            {['Proposal ID', 'Client Name', 'Status', 'Budget', 'Delivery Date', 'AI Recommendations'].map(field => (
              <label key={field} className="flex items-center gap-2 text-sm text-surface-300 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-brand-600" />
                {field}
              </label>
            ))}
          </div>
        </div>
      </Modal>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details: ${selectedOrder.id}`}
          size="lg"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="ghost" onClick={() => setSelectedOrder(null)}>Close</Button>
              {selectedOrder.status === 'Pending' && (
                <>
                  <button
                    onClick={() => handleRejectOrder(selectedOrder)}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-4 py-2 border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-455 text-xs font-bold rounded-xl transition-all disabled:opacity-55"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApproveOrder(selectedOrder)}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 disabled:opacity-55"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve & Pack</span>
                  </button>
                </>
              )}
              {selectedOrder.status === 'Approved & Packing' && (
                <button
                  onClick={() => handleShipOrder(selectedOrder)}
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/15 disabled:opacity-55"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Ship Order</span>
                </button>
              )}
            </div>
          }
        >
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-surface-900/40 border border-surface-700/30 rounded-xl p-4">
              <div>
                <h4 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-0.5">Customer</h4>
                <p className="text-base font-semibold text-surface-100">{selectedOrder.customerName}</p>
                <p className="text-xs text-surface-400">{selectedOrder.companyName}</p>
              </div>
              <div className="text-right">
                <h4 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-0.5">Order Date</h4>
                <p className="text-sm font-semibold text-surface-100">{selectedOrder.orderDate}</p>
                <span className={`inline-block text-[10px] px-2.5 py-0.5 mt-1.5 border rounded-full font-bold uppercase tracking-wider ${
                  selectedOrder.status === 'Pending' ? 'text-amber-400 bg-amber-400/10 border-amber-500/20' :
                  selectedOrder.status === 'Approved & Packing' ? 'text-blue-400 bg-blue-400/10 border-blue-500/20' :
                  selectedOrder.status === 'Rejected' ? 'text-rose-400 bg-rose-500/10 border-rose-600/20' :
                  'text-emerald-400 bg-emerald-400/10 border-emerald-500/20'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-2">Items Ordered</h4>
              <div className="bg-surface-900/60 border border-surface-700/30 rounded-xl divide-y divide-surface-700/40">
                {selectedOrder.items.map((item, idx) => (
                  <div key={item.id + '-' + idx} className="flex justify-between items-center p-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.emoji || '🎁'}</span>
                      <span className="font-semibold text-surface-200">{item.name}</span>
                    </div>
                    <div className="text-surface-400 font-medium">
                      {item.qty} units × {formatCurrency(item.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-surface-700/50 pt-4">
              <span className="text-sm font-bold text-surface-400">Total Order Value</span>
              <span className="text-xl font-black text-emerald-400">{formatCurrency(selectedOrder.total)}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
