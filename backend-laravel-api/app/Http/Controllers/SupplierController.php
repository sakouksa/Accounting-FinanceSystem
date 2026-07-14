<?php

namespace App\Http\Controllers;

use App\Http\Requests\SupplierRequest;
use App\Services\SupplierService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class SupplierController extends Controller implements HasMiddleware
{
    protected $supplierService;

    public function __construct(SupplierService $supplierService)
    {
        $this->supplierService = $supplierService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:suppliers.read', only: ['index', 'show', 'stats']),
            new Middleware('permission:suppliers.create', only: ['store']),
            new Middleware('permission:suppliers.update', only: ['update', 'changeStatus']),
            new Middleware('permission:suppliers.delete', only: ['destroy', 'bulkDelete', 'deleteAll']),
        ];
    }

    // LIST
    public function index(Request $request)
    {
        $paginator = $this->supplierService->getAll($request);

        return $this->paginatedResponse(
            $paginator->items(),
            $paginator->total()
        );
    }

    // STATS
    public function stats()
    {
        $stats = $this->supplierService->getStats();
        return response()->json([
            'stats' => $stats,
        ]);
    }

    // STORE
    public function store(SupplierRequest $request)
    {
        $supplier = $this->supplierService->createSupplier($request->validated());

        return $this->successResponse($supplier, 'បានបង្កើត Supplier ដោយជោគជ័យ', 201);
    }

    // SHOW
    public function show($id)
    {
        $supplier = $this->supplierService->findById($id);
        return $this->successResponse($supplier);
    }

    // UPDATE
    public function update(SupplierRequest $request, $id)
    {
        $supplier = $this->supplierService->updateSupplier($request->validated(), $id);

        return $this->successResponse($supplier, 'បានកែប្រែ Supplier ដោយជោគជ័យ');
    }

    // DELETE
    public function destroy($id)
    {
        try {
            $supplier = $this->supplierService->deleteSupplier($id);
            return $this->successResponse($supplier, 'បានលុប Supplier ដោយជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse('លុបមិនបានជោគជ័យ: '.$e->getMessage(), 400);
        }
    }

    // CHANGE STATUS
    public function changeStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $supplier = $this->supplierService->changeStatus($id, $request->status);

        return $this->successResponse($supplier, 'បានប្តូរស្ថានភាពដោយជោគជ័យ');
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:suppliers,id',
        ]);

        $this->supplierService->bulkDelete($request->ids);

        return $this->successResponse(null, 'លុបជោគជ័យ');
    }

    // DELETE ALL
    public function deleteAll()
    {
        $this->supplierService->deleteAll();

        return $this->successResponse(null, 'លុបទាំងអស់ជោគជ័យ');
    }
}
