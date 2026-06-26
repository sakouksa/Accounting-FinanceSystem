<?php

namespace App\Http\Controllers;

use App\Http\Requests\SupplierRequest;
use App\Models\Supplier;
use App\Services\SupplierService;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    protected $supplierService;

    public function __construct(SupplierService $supplierService)
    {
        $this->supplierService = $supplierService;
    }

    // LIST
    public function index(Request $request)
    {
        $query = Supplier::query();

        if ($request->filled('txt_search')) {
            $search = $request->txt_search;

            $query->where(function ($q) use ($search) {
                $q->where('supplier_code', 'LIKE', "%{$search}%")
                    ->orWhere('supplier_name', 'LIKE', "%{$search}%")
                    ->orWhere('phone', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $limit = $request->get('limit', 10);

        $paginator = $query->latest()->paginate($limit);

        return response()->json([
            'list' => $paginator->items(),
            'total' => $paginator->total(),
        ]);
    }

    // STORE
    public function store(SupplierRequest $request)
    {
        $supplier = $this->supplierService
            ->createSupplier($request->validated());

        return response()->json([
            'data' => $supplier,
            'message' => 'បានបង្កើត Supplier ដោយជោគជ័យ',
        ]);
    }

    // SHOW
    public function show($id)
    {
        return Supplier::findOrFail($id);
    }

    // UPDATE
    public function update(SupplierRequest $request, $id)
    {
        $supplier = $this->supplierService
            ->updateSupplier($request->validated(), $id);

        return response()->json([
            'data' => $supplier,
            'message' => 'បានកែប្រែ Supplier ដោយជោគជ័យ',
        ]);
    }

    // DELETE
    public function destroy($id)
    {
        $supplier = $this->supplierService
            ->deleteSupplier($id);

        return response()->json([
            'data' => $supplier,
            'message' => 'បានលុប Supplier ដោយជោគជ័យ',
        ]);
    }

    // CHANGE STATUS
    public function changeStatus(Request $request, $id)
    {
        $supplier = $this->supplierService
            ->changeStatus($id, $request->status);

        return response()->json([
            'data' => $supplier,
            'message' => 'បានប្តូរស្ថានភាពដោយជោគជ័យ',
        ]);
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        Supplier::whereIn('id', $request->ids)->delete();

        return response()->json([
            'message' => 'លុបជោគជ័យ',
        ]);
    }

    // DELETE ALL
    public function deleteAll()
    {
        Supplier::query()->delete();

        return response()->json([
            'message' => 'លុបទាំងអស់ជោគជ័យ',
        ]);
    }
}
