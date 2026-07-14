import React, { Suspense, lazy } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Spin } from 'antd'

// Fallback Page Loader Component
const PageLoader = () => (
  <div className='flex items-center justify-center min-h-[400px] w-full' style={{ height: '70vh' }}>
    <Spin size='large' description='កំពុងដំណើរការ...' />
  </div>
)

// Lazy Loaded Pages
const HomePage = lazy(() => import('../page/home/HomePage'))
const SupplierPage = lazy(() => import('../page/supplier/SupplierPage'))
const RolePage = lazy(() => import('../page/role/RolePage'))
const BranchesPage = lazy(() => import('../page/branches/BranchesPage'))
const ProfilePage = lazy(() => import('../page/user_profile/ProfilePage'))
const SettingPage = lazy(() => import('../page/user_profile/SettingPage'))
const Error500 = lazy(() => import('../page/error-page/500'))
const RouteNoFound = lazy(() => import('../page/error-page/404'))
const LoginPage = lazy(() => import('../page/auth/LoginPage'))
const RegisterPage = lazy(() => import('../page/auth/RegisterPage'))
const CurrencyPage = lazy(() => import('../page/currency/CurrencyPage'))
const PaymentMethod = lazy(() => import('../page/paymentmethod/PaymentMethodPage'))
const AccountTypePage = lazy(() => import('../page/account_types/AccountTypePage'))
const AuditLogPage = lazy(() => import('../page/auditlog/AuditLogPage'))
const ChartOfAccountPage = lazy(() => import('../page/chart_of_accounts/ChartOfAccountPage'))
const TransactionPage = lazy(() => import('../page/transactions/TransactionPage'))
const TransactionTypePage = lazy(() => import('../page/transactiontype/TransactionTypePage'))
const TransactionDetailPage = lazy(() => import('../page/transactiondetail/TransactionDetailPage'))
const CustomerPage = lazy(() => import('../page/customer/CustomerPage'))
const AccountsReceivablePage = lazy(() => import('../page/accounts_receivable/AccountsReceivablePage'))
const AccountsPayablePage = lazy(() => import('../page/accounts_payable/AccountsPayablePage'))
const PaymentPage = lazy(() => import('../page/payment/PaymentPage'))
const CashFlowPage = lazy(() => import('../page/cash_flows/CashFlowPage'))
const BudgetPage = lazy(() => import('../page/budget/BudgetPage'))
const FinancialReportPage = lazy(() => import('../page/financial_report/FinancialReportPage'))
const ReportPage = lazy(() => import('../page/report/ReportPage'))
const ForgotPasswordPage = lazy(() => import('../page/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('../page/auth/ResetPasswordPage'))
const LoginHistoriesPage = lazy(() => import('../page/login_histories/LoginHistoriesPage'))
const AddUserForm = lazy(() => import('../page/add_user/AddUser'))
const UsersPage = lazy(() => import('../page/user/UsersPage'))
const RolePermissionPage = lazy(() => import('../page/role_permission/RolePermissionPage'))
const PermissionPage = lazy(() => import('../page/permission/PermissionPage'))

// Layout
import MainLayout from '../components/layout/MainLayout'

const ProtectedRoutes = () => (
  <MainLayout>
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  </MainLayout>
)

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />

        {/* Protected Routes (MainLayout) */}
        <Route element={<ProtectedRoutes />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/profiles' element={<ProfilePage />} />
          <Route path='/profile-settings' element={<SettingPage />} />
          <Route path='/suppliers' element={<SupplierPage />} />
          <Route path='/role' element={<RolePage />} />
          <Route path='/branches' element={<BranchesPage />} />
          <Route path='/currencies' element={<CurrencyPage />} />
          <Route path='/payment-methods' element={<PaymentMethod />} />
          <Route path='/account-types' element={<AccountTypePage />} />
          <Route path='/audit-logs' element={<AuditLogPage />} />
          <Route path='/chart-of-accounts' element={<ChartOfAccountPage />} />
          <Route path='/transactions' element={<TransactionPage />} />
          <Route path='/transaction-types' element={<TransactionTypePage />} />
          <Route
            path='/transaction-details'
            element={<TransactionDetailPage />}
          />
          <Route
            path='/accounts-receivable'
            element={<AccountsReceivablePage />}
          />
          <Route path='/customers' element={<CustomerPage />} />
          <Route path='/accounts-payable' element={<AccountsPayablePage />} />
          <Route path='/payments' element={<PaymentPage />} />
          <Route path='/cash-flows' element={<CashFlowPage />} />
          <Route path='/budgets' element={<BudgetPage />} />
          <Route path='/financial-reports' element={<FinancialReportPage />} />
          <Route path='/reports' element={<ReportPage />} />
          <Route path='/roles' element={<RolePage />} />
          <Route path='/users' element={<UsersPage />} />
          <Route path='/login-histories' element={<LoginHistoriesPage />} />
          <Route path='/add-user' element={<AddUserForm />} />
          <Route path='/role-permissions' element={<RolePermissionPage />} />
          <Route path='/permissions' element={<PermissionPage />} />
          <Route path='/500' element={<Error500 />} />
        </Route>

        {/* 404 */}
        <Route path='*' element={<RouteNoFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
