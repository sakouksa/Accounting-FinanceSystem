<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionTypeRequest;
use App\Services\TransactionTypeService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class TransactionTypeController extends Controller implements HasMiddleware
{
    protected $typeService;

    public function __construct(TransactionTypeService $typeService)
    {
        $this->typeService = $typeService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:transaction_types.read', only: ['index', 'show', 'stats']),
            new Middleware('permission:transaction_types.create', only: ['store']),
            new Middleware('permission:transaction_types.update', only: ['update', 'changeStatus']),
            new Middleware('permission:transaction_types.delete', only: ['destroy', 'bulkDelete', 'deleteAll']),
        ];
    }

    public function index(Request $request)
    {
        try {
            $paginator = $this->typeService->getAll($request);

            return $this->paginatedResponse(
                $paginator->items(),
                $paginator->total()
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function stats()
    {
        $stats = $this->typeService->getStats();
        return response()->json(['stats' => $stats]);
    }

    public function store(TransactionTypeRequest $request)
    {
        try {
            $data = $this->typeService->createTransactionType($request->validated());

            return $this->successResponse($data, 'បានបង្កើតជោគជ័យ', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show(string $id)
    {
        try {
            $data = $this->typeService->findById($id);
            return $this->successResponse($data);
        } catch (\Exception $e) {
            return $this->errorResponse('រកមិនឃើញទិន្នន័យ', 404);
        }
    }

    public function update(TransactionTypeRequest $request, string $id)
    {
        try {
            $data = $this->typeService->updateTransactionType($request->validated(), $id);

            return $this->successResponse($data, 'បានកែប្រែជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $data = $this->typeService->deleteTransactionType($id);
            return $this->successResponse($data, 'លុបជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse('រកមិនឃើញទិន្នន័យ', 404);
        }
    }

    public function changeStatus(Request $request, $id)
    {
        $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $data = $this->typeService->changeStatus($id, $request->is_active);

        return $this->successResponse($data, 'ប្តូរស្ថានភាពជោគជ័យ');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:transaction_types,id',
        ]);

        $this->typeService->bulkDelete($request->ids);

        return $this->successResponse(null, 'លុបជោគជ័យ');
    }

    public function deleteAll()
    {
        $this->typeService->deleteAll();

        return $this->successResponse(null, 'លុបទាំងអស់ជោគជ័យ');
    }
}
