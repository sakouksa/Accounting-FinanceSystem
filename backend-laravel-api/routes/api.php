<?php

use App\Http\Controllers\AccountTypeController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ChartOfAccountController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

// auth
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
// end auth
// middleware auth:api
Route::middleware('auth:api')->group(function () {
    // roles
    Route::get('/roles/stats', [RoleController::class, 'stats']);
    Route::apiResource('roles', RoleController::class);
    // end roles
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
    Route::patch('/transactions/{id}/status', [TransactionController::class, 'changeStatus']);
    Route::apiResource('transactions', TransactionController::class);
    Route::post('/transactions/bulk-delete', [TransactionController::class, 'bulkDelete']);
    Route::post('/transactions/delete-all', [TransactionController::class, 'deleteAll']);
    // end transactions
    //  logout
    Route::post('logout', [AuthController::class, 'logout']);
    // end logout
    // end middleware auth:api
});
