<?php

use App\Http\Controllers\AccountsPayableController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\AccountsReceivableController;
use App\Http\Controllers\AccountTypeController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CashFlowController;
use App\Http\Controllers\ChartOfAccountController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\FinancialReportController;
use App\Http\Controllers\LoginHistoryController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransactionDetailController;
use App\Http\Controllers\TransactionTypeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RolePermissionController;
use Illuminate\Support\Facades\Route;

// auth
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
// end auth
// middleware auth:api
Route::middleware('auth:api')->group(function () {
    // profile
    Route::get('profile/getProfile', [ProfileController::class, 'profile']);
    Route::get('/profile/dashboard-stats', [ProfileController::class, 'dashboardStats']);
    Route::post('profile/update', [ProfileController::class, 'update']);
    Route::put('/change-password', [ProfileController::class, 'changePassword']);
    // end profile
    // roles
    Route::get('roles/stats', [RoleController::class, 'stats']);
    Route::get('permissions/all', [RoleController::class, 'getAllPermissionsList']); // Legacy flat list
    Route::apiResource('roles', RoleController::class);
    // end roles
    // permissions CRUD
    Route::apiResource('permissions', PermissionController::class);
    // end permissions
    // role-permissions
    Route::get('role-permissions', [RolePermissionController::class, 'index']);
    Route::get('role-permissions/{roleId}', [RolePermissionController::class, 'getRolePermissions']);
    Route::post('role-permissions/{roleId}/sync', [RolePermissionController::class, 'syncPermissions']);
    // end role-permissions
    // branches
    Route::get('/branches/stats', [BranchController::class, 'stats']);
    Route::patch('/branches/{id}/status', [BranchController::class, 'changeStatus']);
    Route::apiResource('branches', BranchController::class);
    Route::post('/branches/bulk-delete', [BranchController::class, 'bulkDelete']);
    Route::post('/branches/delete-all', [BranchController::class, 'deleteAll']);
    // end branches
    // currencies
    Route::get('/currencies/stats', [CurrencyController::class, 'stats']);
    Route::patch('/currencies/{id}/status', [CurrencyController::class, 'changeStatus']);
    Route::apiResource('currencies', CurrencyController::class);
    Route::post('/currencies/bulk-delete', [CurrencyController::class, 'bulkDelete']);
    Route::post('/currencies/delete-all', [CurrencyController::class, 'deleteAll']);
    // end currencies
    // payment methods
    Route::get('/payment-methods/stats', [PaymentMethodController::class, 'stats']);
    Route::patch('/payment-methods/{id}/status', [PaymentMethodController::class, 'changeStatus']);
    Route::apiResource('payment-methods', PaymentMethodController::class);
    Route::post('/payment-methods/bulk-delete', [PaymentMethodController::class, 'bulkDelete']);
    Route::post('/payment-methods/delete-all', [PaymentMethodController::class, 'deleteAll']);
    // end payment methods
    // account types of chart of accounts
    Route::get('/account-types/stats', [AccountTypeController::class, 'stats']);
    Route::apiResource('account-types', AccountTypeController::class);
    Route::post('/account-types/bulk-delete', [AccountTypeController::class, 'bulkDelete']);
    Route::post('/account-types/delete-all', [AccountTypeController::class, 'deleteAll']);
    // end account types of chart of accounts
    // audit logs
    Route::get('/audit-logs', [AuditLogController::class, 'index']);
    Route::get('/audit-logs/stats', [AuditLogController::class, 'stats']);
    Route::get('/audit-logs/{id}', [AuditLogController::class, 'show']);
    // end audit logs
    // chart of accounts
    Route::get('/chart-of-accounts/stats', [ChartOfAccountController::class, 'stats']);
    Route::patch('/chart-of-accounts/{id}/status', [ChartOfAccountController::class, 'changeStatus']);
    Route::apiResource('chart-of-accounts', ChartOfAccountController::class);
    Route::post('/chart-of-accounts/bulk-delete', [ChartOfAccountController::class, 'bulkDelete']);
    Route::post('/chart-of-accounts/delete-all', [ChartOfAccountController::class, 'deleteAll']);
    // end chart of accounts
    // transactions
    Route::get('/transactions/stats', [TransactionController::class, 'stats']);
    Route::apiResource('transactions', TransactionController::class);
    Route::post('/transactions/bulk-delete', [TransactionController::class, 'bulkDelete']);
    Route::post('/transactions/delete-all', [TransactionController::class, 'deleteAll']);
    // end transactions
    // transaction types
    Route::get('/transaction-types/stats', [TransactionTypeController::class, 'stats']);
    Route::patch('/transaction-types/{id}/status', [TransactionTypeController::class, 'changeStatus']);
    Route::apiResource('transaction-types', TransactionTypeController::class);
    Route::post('/transaction-types/bulk-delete', [TransactionTypeController::class, 'bulkDelete']);
    Route::post('/transaction-types/delete-all', [TransactionTypeController::class, 'deleteAll']);
    // end transaction types
    // transaction Details
    Route::get('/transaction-details/stats', [TransactionDetailController::class, 'stats']);
    Route::get('/transaction-details/{id}', [TransactionDetailController::class, 'show']);
    Route::apiResource('transaction-details', TransactionDetailController::class);
    Route::post('/transaction-details/bulk-delete', [TransactionDetailController::class, 'bulkDelete']);
    Route::post('/transaction-details/delete-all', [TransactionDetailController::class, 'deleteAll']);
    // end transaction Details
    // customers
    Route::get('/customers/stats', [CustomerController::class, 'stats']);
    Route::patch('/customers/{id}/status', [CustomerController::class, 'changeStatus']);
    Route::apiResource('customers', CustomerController::class);
    Route::post('/customers/bulk-delete', [CustomerController::class, 'bulkDelete']);
    Route::post('/customers/delete-all', [CustomerController::class, 'deleteAll']);
    // end customers
    // suppliers
    Route::get('/suppliers/stats', [SupplierController::class, 'stats']);
    Route::patch('/suppliers/{id}/status', [SupplierController::class, 'changeStatus']);
    Route::apiResource('suppliers', SupplierController::class);
    Route::post('/suppliers/bulk-delete', [SupplierController::class, 'bulkDelete']);
    Route::post('/suppliers/delete-all', [SupplierController::class, 'deleteAll']);
    // end suppliers
    // Accounts Receivable
    Route::get('/accounts-receivable/stats', [AccountsReceivableController::class, 'stats']);
    Route::patch('/accounts-receivable/{id}/status', [AccountsReceivableController::class, 'changeStatus']);
    Route::apiResource('accounts-receivable', AccountsReceivableController::class);
    Route::post('/accounts-receivable/bulk-delete', [AccountsReceivableController::class, 'bulkDelete']);
    Route::post('/accounts-receivable/delete-all', [AccountsReceivableController::class, 'deleteAll']);
    // end Accounts Receivable
    // Accounts Payable
    Route::get('/accounts-payable/stats', [AccountsPayableController::class, 'stats']);
    Route::patch('/accounts-payable/{id}/status', [AccountsPayableController::class, 'changeStatus']);
    Route::apiResource('accounts-payable', AccountsPayableController::class);
    Route::post('/accounts-payable/bulk-delete', [AccountsPayableController::class, 'bulkDelete']);
    Route::post('/accounts-payable/delete-all', [AccountsPayableController::class, 'deleteAll']);
    // end Accounts Payable
    // Payment
    Route::get('/payments/stats', [PaymentController::class, 'stats']);
    Route::patch('/payments/{id}/status', [PaymentController::class, 'changeStatus']);
    Route::apiResource('payments', PaymentController::class);
    Route::post('/payments/bulk-delete', [PaymentController::class, 'bulkDelete']);
    Route::post('/payments/delete-all', [PaymentController::class, 'deleteAll']);
    // end Payment
    // CashFlow
    Route::get('/cashflow/stats', [CashFlowController::class, 'stats']);
    Route::patch('/cashflow/{id}/status', [CashFlowController::class, 'changeStatus']);
    Route::apiResource('cashflow', CashFlowController::class);
    Route::post('/cashflow/bulk-delete', [CashFlowController::class, 'bulkDelete']);
    Route::post('/cashflow/delete-all', [CashFlowController::class, 'deleteAll']);
    // end CashFlow
    // Budget
    Route::get('/budgets/stats', [BudgetController::class, 'stats']);
    Route::patch('/budgets/{id}/status', [BudgetController::class, 'changeStatus']);
    Route::apiResource('budgets', BudgetController::class);
    Route::post('/budgets/bulk-delete', [BudgetController::class, 'bulkDelete']);
    Route::post('/budgets/delete-all', [BudgetController::class, 'deleteAll']);
    // end Budget
    // Financial Report
    Route::get('financial-reports/stats', [FinancialReportController::class, 'getStats']);
    Route::get('/financial-reports/preview', [FinancialReportController::class, 'preview']);
    Route::post('/financial-reports/bulk-delete', [FinancialReportController::class, 'bulkDelete']);
    Route::post('/financial-reports/delete-all', [FinancialReportController::class, 'deleteAll']); // Added missing route
    Route::apiResource('financial-reports', FinancialReportController::class);
    // end Financial Report
    // Report
    Route::get('reports/stats', [ReportController::class, 'getStats']); // Placed above resource to avoid id collision
    Route::get('/reports/preview', [ReportController::class, 'preview']);
    Route::post('/reports/bulk-delete', [ReportController::class, 'bulkDelete']);
    Route::post('/reports/delete-all', [ReportController::class, 'deleteAll']);
    Route::apiResource('reports', ReportController::class);
    // end Report
    // login histories
    Route::get('/login-histories', [LoginHistoryController::class, 'index']);
    Route::get('/login-histories/stats', [LoginHistoryController::class, 'stats']);
    // optional if you want detail view later
    // Route::get('/login-histories/{id}', [LoginHistoryController::class, 'show']);
    // end login histories
    // home
    Route::get('/dashboard', [HomeController::class, 'dashboard']);
    //end home
    // User Routes
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::post('/users/{id}/restore', [UserController::class, 'restore']);
    Route::delete('/users/{id}/force', [UserController::class, 'forceDelete']);
    Route::patch('/users/{id}/status', [UserController::class, 'changeStatus']);
    Route::put('/users/{id}/change-password', [UserController::class, 'changePassword']);
    Route::get('/default-roles', [UserController::class, 'getDefaultRoles']);
    Route::get('/users/all-permissions', [UserController::class, 'getAllPermissions']);
    Route::get('/branches-list', [UserController::class, 'getBranches']);
    //  logout
    Route::post('logout', [AuthController::class, 'logout']);
    // end logout
    // end middleware auth:api
});
Route::post('/forgot-password', [ProfileController::class, 'forgotPassword']);
Route::post('/reset-password', [ProfileController::class, 'resetPassword']);