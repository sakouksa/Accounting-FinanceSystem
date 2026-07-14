<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class TransactionController extends Controller implements HasMiddleware
{
    protected $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:transactions.read', only: ['index', 'show', 'stats']),
            new Middleware('permission:transactions.create', only: ['store']),
            new Middleware('permission:transactions.update', only: ['update']),
            new Middleware('permission:transactions.delete', only: ['destroy', 'bulkDelete', 'deleteAll']),
        ];
    }

    public function index(Request $request)
    {
        try {
            $paginator = $this->transactionService->getAll($request);

            return $this->paginatedResponse(
                $paginator->items(),
                $paginator->total(),
                200,
                'Success',
                [
                    'branches' => $this->transactionService->getBranchesLookup(),
                    'transaction_types' => $this->transactionService->getTransactionTypesLookup(),
                ]
            );
        } catch (\Exception $e) {
            \Log::error('Transaction Error: '.$e->getMessage());
            return $this->errorResponse('ទាញទិន្នន័យបរាជ័យ: '.$e->getMessage(), 500);
        }
    }

    public function stats()
    {
        $stats = $this->transactionService->getStats();
        return response()->json([
            'stats' => $stats,
        ]);
    }

    public function store(TransactionRequest $request)
    {
        try {
            $transaction = $this->transactionService->createTransaction($request->validated());

            return $this->successResponse(
                $transaction->load(['branch', 'details', 'transactionType']),
                'បានបង្កើតប្រតិបត្តិការជោគជ័យ',
                201
            );
        } catch (\Exception $e) {
            \Log::error('Create Transaction Error: '.$e->getMessage());
            return $this->errorResponse('បង្កើតមិនបានជោគជ័យ: '.$e->getMessage(), 500);
        }
    }

    public function show(string $id)
    {
        try {
            $transaction = $this->transactionService->findById($id);
            return $this->successResponse($transaction);
        } catch (\Exception $e) {
            return $this->errorResponse('រកមិនឃើញទិន្នន័យ', 404);
        }
    }

    public function update(TransactionRequest $request, string $id)
    {
        try {
            $transaction = $this->transactionService->updateTransaction($request->validated(), $id);

            return $this->successResponse(
                $transaction->load(['branch', 'details', 'transactionType']),
                'បានកែប្រែប្រតិបត្តិការជោគជ័យ'
            );
        } catch (\Exception $e) {
            \Log::error('Update Transaction Error: '.$e->getMessage());
            return $this->errorResponse('កែប្រែមិនបានជោគជ័យ: '.$e->getMessage(), 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $transaction = $this->transactionService->deleteTransaction($id);
            return $this->successResponse($transaction, 'លុបជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse('រកមិនឃើញប្រតិបត្តិការ', 404);
        }
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:transactions,id',
        ]);

        $this->transactionService->bulkDelete($request->ids);

        return $this->successResponse(null, 'លុបជោគជ័យ');
    }

    public function deleteAll()
    {
        $this->transactionService->deleteAll();

        return $this->successResponse(null, 'លុបទាំងអស់ជោគជ័យ');
    }
}
