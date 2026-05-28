<?php

use App\Http\Controllers\AccountTypeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\RoleController;
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
    //  logout
    Route::post('logout', [AuthController::class, 'logout']);
    // end logout
    // end middleware auth:api
});
