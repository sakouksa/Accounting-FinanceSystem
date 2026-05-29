import { Routes, Route, Outlet } from 'react-router-dom';

// Pages
import HomePage from '../page/home/HomePage';
import SupplierPage from '../page/supplier/SupplierPage';
import RolePage from '../page/role/RolePage';
import BranchesPage from '../page/branches/BranchesPage';
import ProfilePage from '../page/user_profile/ProfilePage';
import SettingPage from '../page/user_profile/SettingPage';
import Error500 from '../page/error-page/500';
import RouteNoFound from '../page/error-page/404';
import LoginPage from '../page/auth/LoginPage';
import RegisterPage from '../page/auth/RegisterPage';
import CurrencyPage from '../page/currency/CurrencyPage';
import PaymentMethod from '../page/paymentmethod/PaymentMethodPage';

// Layout
import MainLayout from '../components/layout/MainLayout';
import AccountTypePage from '../page/account_types/AccountTypePage';
import AuditLogPage from '../page/auditlog/AuditLogPage';
import ChartOfAccountPage from '../page/chart_of_accounts/ChartOfAccountPage';

const ProtectedRoutes = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes (MainLayout) */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/profiles" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/supplier" element={<SupplierPage />} />
        <Route path="/role" element={<RolePage />} />
        <Route path="/branches" element={<BranchesPage />} />
        <Route path="/currencies" element={<CurrencyPage />} />
        <Route path="/payment-methods" element={<PaymentMethod />} />
        <Route path="/account-types" element={<AccountTypePage />} />
        <Route path="/audit-logs" element={<AuditLogPage />} />
        <Route path="/chart-of-accounts" element={<ChartOfAccountPage />} />
        <Route path="/500" element={<Error500 />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<RouteNoFound />} />
    </Routes>
  );
};

export default AppRoutes;