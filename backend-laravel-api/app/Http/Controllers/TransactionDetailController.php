<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionDetailRequest;
use App\Services\TransactionDetailService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class TransactionDetailController extends Controller implements HasMiddleware
{
    protected $detailService;

    public function __construct(TransactionDetailService $detailService)
    {
        $this->detailService = $detailService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:transaction_details.read', only: ['index', 'show', 'stats']),
            new Middleware('permission:transaction_details.create', only: ['store']),
            new Middleware('permission:transaction_details.update', only: ['update']),
            new Middleware('permission:transaction_details.delete', only: ['destroy', 'bulkDelete', 'deleteAll']),
        ];
    }

    public function index(Request $request)
    {
        try {
            $paginator = $this->detailService->getAll($request);

            return $this->paginatedResponse(
                $paginator->items(),
                $paginator->total(),
                200,
                'Success',
                [
                    'transaction' => $this->detailService->getTransactionsLookup(),
                    'account' => $this->detailService->getAccountsLookup(),
                ]
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function stats()
    {
        $stats = $this->detailService->getStats();
        return response()->json(['stats' => $stats]);
    }

    public function store(TransactionDetailRequest $request)
    {
        try {
            $data = $this->detailService->createTransactionDetail($request->validated());

            return $this->successResponse(
                $data->load(['transaction', 'account']),
                'បានបង្កើតជោគជ័យ',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(string $id)
    {
        try {
            $data = $this->detailService->findById($id);
            return $this->successResponse($data);
        } catch (\Exception $e) {
            return $this->errorResponse('រកមិនឃើញទិន្នន័យ', 404);
        }
    }

    public function update(TransactionDetailRequest $request, string $id)
    {
        try {
            $data = $this->detailService->updateTransactionDetail($request->validated(), $id);

            return $this->successResponse(
                $data->load(['transaction', 'account']),
                'បានកែប្រែជោគជ័យ'
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $data = $this->detailService->deleteTransactionDetail($id);
            return $this->successResponse($data, 'លុបជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse('រកមិនឃើញទិន្នន័យ', 404);
        }
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:transaction_details,id',
        ]);

        $this->detailService->bulkDelete($request->ids);

        return $this->successResponse(null, 'លុបជោគជ័យ');
    }

    public function deleteAll()
    {
        $this->detailService->deleteAll();

        return $this->successResponse(null, 'លុបទាំងអស់ជោគជ័យ');
    }
}
