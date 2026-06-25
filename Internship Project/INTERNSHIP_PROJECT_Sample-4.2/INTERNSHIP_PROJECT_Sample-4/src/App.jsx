import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import CustomerLayout from './components/layout/CustomerLayout';
import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/LoginPage';

// Customer Pages
import GiftOrder from './pages/customer/Store';           // Gift Order (enhanced store)
import CustomForm from './pages/customer/CustomForm';
import PersonalizationManager from './pages/customer/PersonalizationManager';
import DesignApproval from './pages/customer/DesignApproval';
import InventoryScreen from './pages/customer/InventoryScreen';
import OccasionCalendarPage from './pages/customer/OccasionCalendarPage';
import ReturnRequest from './pages/customer/ReturnRequest';
import EnquiryPortal from './pages/customer/Enquiry';
import CustomerDashboard from './pages/customer/CustomerDashboard';

// Proposal Pages
import ProposalDashboard from './pages/proposal/ProposalDashboard';
import CreateProposal from './pages/proposal/CreateProposal';
import ProposalDetails from './pages/proposal/ProposalDetails';

// Team Pages
import AdminDash from './pages/team/AdminDash';
import OrdersManager from './pages/team/OrdersManager';
import StoreManager from './pages/team/StoreManager';
import AdminReturns from './pages/team/AdminReturns';
import AdminEnquiries from './pages/team/AdminEnquiries';

function RootRedirect() {
  const { isAuthenticated, currentUser } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  const role = currentUser?.role || 'customer';
  if (['admin', 'designer', 'production', 'dispatch', 'sales'].includes(role)) {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/customer/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* ── Customer Portal ── */}
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<Navigate to="/customer/dashboard" replace />} />
            <Route path="dashboard"        element={<CustomerDashboard />} />
            <Route path="store"            element={<GiftOrder />} />
            <Route path="custom-form"      element={<CustomForm />} />
            <Route path="personalize"      element={<PersonalizationManager />} />
            <Route path="design-approvals" element={<DesignApproval />} />
            <Route path="inventory"        element={<InventoryScreen />} />
            <Route path="calendar"         element={<OccasionCalendarPage />} />
            <Route path="returns"          element={<ReturnRequest />} />
            <Route path="enquiries"        element={<EnquiryPortal />} />
            <Route path="proposals/:id"    element={<ProposalDetails />} />
          </Route>

          {/* ── Admin Portal ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDash />} />
            <Route path="orders"     element={<OrdersManager />} />
            <Route path="manage-store" element={<StoreManager />} />
            <Route path="design-approvals" element={<DesignApproval />} />
            <Route path="proposals"         element={<ProposalDashboard />} />
            <Route path="proposals/:id"     element={<ProposalDetails />} />
            <Route path="proposals/create"  element={<CreateProposal />} />
            <Route path="returns" element={<AdminReturns />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
