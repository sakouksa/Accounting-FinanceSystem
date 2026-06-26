import { Routes, Route, Outlet } from 'react-router-dom'

// Pages
import HomePage from '../page/home/HomePage'
import SupplierPage from '../page/supplier/SupplierPage'
import RolePage from '../page/role/RolePage'
import BranchesPage from '../page/branches/BranchesPage'
import ProfilePage from '../page/user_profile/ProfilePage'
import SettingPage from '../page/user_profile/SettingPage'
import Error500 from '../page/error-page/500'
import RouteNoFound from '../page/error-page/404'
import LoginPage from '../page/auth/LoginPage'
import RegisterPage from '../page/auth/RegisterPage'
import CurrencyPage from '../page/currency/CurrencyPage'
import PaymentMethod from '../page/paymentmethod/PaymentMethodPage'

// Layout
import MainLayout from '../components/layout/MainLayout'
import AccountTypePage from '../page/account_types/AccountTypePage'
import AuditLogPage from '../page/auditlog/AuditLogPage'
import ChartOfAccountPage from '../page/chart_of_accounts/ChartOfAccountPage'
import TransactionPage from '../page/transactions/TransactionPage'
import TransactionTypePage from '../page/transactiontype/TransactionTypePage'
import TransactionDetailPage from '../page/transactiondetail/TransactionDetailPage'
import CustomerPage from '../page/customer/CustomerPage'
import AccountsReceivablePage from '../page/accounts_receivable/AccountsReceivablePage'
import AccountsPayablePage from '../page/accounts_payable/AccountsPayablePage'
import PaymentPage from '../page/payment/PaymentPage'
import CashFlowPage from '../page/cash_flows/CashFlowPage'
import BudgetPage from '../page/budget/BudgetPage'
import FinancialReportPage from '../page/financial_report/FinancialReportPage'
import ReportPage from '../page/report/ReportPage'
import ForgotPasswordPage from '../page/auth/ForgotPasswordPage'
import ResetPasswordPage from '../page/auth/ResetPasswordPage'
import LoginHistoriesPage from '../page/login_histories/LoginHistoriesPage'
import AddUserForm from '../page/add_user/AddUser'

const ProtectedRoutes = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
)

const AppRoutes = () => {
  return (
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
        <Route path='/login-histories' element={<LoginHistoriesPage />} />
        <Route path='/add-user' element={<AddUserForm />} />
        <Route path='/500' element={<Error500 />} />
      </Route>

      {/* 404 */}
      <Route path='*' element={<RouteNoFound />} />
    </Routes>
  )
}

export default AppRoutes
