<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccountsReceivableRequest;
use App\Models\Customer;
use App\Services\AccountsReceivableService;
use Illuminate\Http\Request;

class AccountsReceivableController extends Controller
{
    protected $arService;

    public function __construct(AccountsReceivableService $arService)
    {
        $this->arService = $arService;
    }

    // LIST
    public function index(Request $request)
    {
        $paginator = $this->arService->getAll($request);

        return response()->json([
            'list' => $paginator->items(),
            'total' => $paginator->total(),
            'customers' => Customer::select('id', 'customer_name')->get(),
        ]);
    }

    // STORE
    public function store(AccountsReceivableRequest $request)
    {
        $data = $this->arService->createAR($request->validated());

        return response()->json([
            'data' => $data,
            'message' => 'បានបង្កើត Accounts Receivable ដោយជោគជ័យ',
        ]);
    }

    // SHOW
    public function show($id)
    {
        return $this->arService->findById($id);
    }

    // UPDATE
    public function update(AccountsReceivableRequest $request, $id)
    {
        $data = $this->arService->updateAR(
            $request->validated(),
            $id
        );

        return response()->json([
            'data' => $data,
            'message' => 'បានកែប្រែ Accounts Receivable ដោយជោគជ័យ',
        ]);
    }

    // DELETE
    public function destroy($id)
    {
        $data = $this->arService->deleteAR($id);

        return response()->json([
            'data' => $data,
            'message' => 'បានលុប Accounts Receivable ដោយជោគជ័យ',
        ]);
    }

    // CHANGE STATUS
    public function changeStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:unpaid,partial,paid',
        ]);

        $data = $this->arService->changeStatus(
            $id,
            $request->status
        );

        return response()->json([
            'data' => $data,
            'message' => 'បានប្តូរស្ថានភាពដោយជោគជ័យ',
        ]);
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:accounts_receivable,id',
        ]);

        $this->arService->bulkDelete($request->ids);

        return response()->json([
            'message' => 'លុបជោគជ័យ',
        ]);
    }

    // DELETE ALL
    public function deleteAll()
    {
        $this->arService->deleteAll();

        return response()->json([
            'message' => 'លុបទាំងអស់ជោគជ័យ',
        ]);
    }

    // STATS
    public function stats()
    {
        return response()->json([
            'stats' => $this->arService->getStats(),
        ]);
    }
}
