// Application constants

export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  customer: 'Customer',
  admin: 'Admin',
};

export const PROPOSAL_STATUSES = {
  DRAFT: 'Draft',
  AI_PROCESSING: 'AI-Processing',
  DESIGNER_REVIEW: 'Designer-Review',
  APPROVED: 'Approved',
  DISPATCHED: 'Dispatched',
};

export const STATUS_CONFIG = {
  Draft: {
    label: 'Draft',
    bg: 'bg-surface-700',
    text: 'text-surface-300',
    dot: 'bg-surface-400',
    border: 'border-surface-600',
  },
  'AI-Processing': {
    label: 'AI Processing',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    border: 'border-blue-200',
    pulse: true,
  },
  'Designer-Review': {
    label: 'Designer Review',
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    border: 'border-amber-200',
  },
  Approved: {
    label: 'Approved',
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    border: 'border-emerald-200',
  },
  Dispatched: {
    label: 'Dispatched',
    bg: 'bg-violet-100',
    text: 'text-violet-700',
    dot: 'bg-violet-500',
    border: 'border-violet-200',
  },
  Rejected: {
    label: 'Rejected',
    bg: 'bg-rose-100',
    text: 'text-rose-700',
    dot: 'bg-rose-500',
    border: 'border-rose-200',
  },
};

export const PRIORITY_CONFIG = {
  High: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  Medium: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  Low: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
};

export const NAV_LINKS = {
  customer: [
    { label: 'Customer Overview', path: '/customer/dashboard', icon: 'LayoutDashboard' },
    { label: 'Online Gift Order', path: '/customer/store', icon: 'ShoppingCart' },
    { label: 'Custom Gift Form', path: '/customer/custom-form', icon: 'Gift' },
    { label: 'Branding Upload Portal', path: '/customer/personalize', icon: 'UploadCloud' },
    { label: 'Design Approvals', path: '/customer/design-approvals', icon: 'CheckSquare' },
    { label: 'Inventory', path: '/customer/inventory', icon: 'Package' },
    { label: 'Occasion Calendar', path: '/customer/calendar', icon: 'Calendar' },
    { label: 'Return Request', path: '/customer/returns', icon: 'RotateCcw' },
    { label: 'Corporate Enquiry Portal', path: '/customer/enquiries', icon: 'MessageSquare' },
  ],
  admin: [
    { label: 'Admin Overview', path: '/admin', icon: 'LayoutDashboard' },
    { label: 'Customer Orders', path: '/admin/orders', icon: 'ShoppingCart' },
    { label: 'Manage Gift Store', path: '/admin/manage-store', icon: 'Package' },
    { label: 'Design Approvals', path: '/admin/design-approvals', icon: 'CheckSquare' },
    { label: 'All Proposals', path: '/admin/proposals', icon: 'FileText' },
    { label: 'Return Requests', path: '/admin/returns', icon: 'RotateCcw' },
    { label: 'Corporate Enquiries', path: '/admin/enquiries', icon: 'MessageSquare' },
  ],
};

export const CLIENT_TYPES = ['Enterprise', 'BFSI', 'Healthcare', 'Retail', 'Manufacturing', 'Hospitality', 'Startup', 'Education', 'Government'];
export const BRANDING_OPTIONS = ['Logo Embossing', 'Laser Engraving', 'Screen Printing', 'Embroidery', 'Digital Print', 'Gold Foil Print', 'Monogram Engraving', 'Custom Packaging', 'Custom Label', 'Eco-Friendly Material'];
export const OCCASIONS = ['New Year', 'Annual Client Appreciation', 'Product Launch', 'Festive Season', 'Employee Rewards', 'Board Member Gifting', 'Healthcare Worker Appreciation', 'Team Building Event', 'Dealer Awards', 'Store Opening', 'VIP Guest Welcome'];

export const productCategories = ['All', 'Stationery', 'Office', 'Electronics', 'Food & Beverage', 'Eco-Friendly', 'Apparel', 'Lifestyle', 'Hampers'];

