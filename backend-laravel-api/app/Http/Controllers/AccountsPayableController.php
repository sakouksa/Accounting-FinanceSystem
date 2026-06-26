<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccountsPayableRequest;
use App\Models\AccountsPayable;
use App\Models\Supplier;
use App\Services\AccountsPayableService;
use Illuminate\Http\Request;

class AccountsPayableController extends Controller
{
    protected $accountsPayableService;

    public function __construct(AccountsPayableService $accountsPayableService)
    {
        $this->accountsPayableService = $accountsPayableService;
    }

    // LIST
    public function index(Request $request)
    {
        $paginator = $this->accountsPayableService->getAll($request);

        return response()->json([
            'list' => $paginator->items(),
            'total' => $paginator->total(),
            'suppliers' => Supplier::select('id', 'supplier_name')->get(),
        ]);
    }

    // STATS
    public function stats()
    {
        return response()->json([
            'stats' => $this->accountsPayableService->getStats(),
        ]);
    }

    // STORE
    public function store(AccountsPayableRequest $request)
    {
        $accountsPayable = $this->accountsPayableService
            ->createAccountsPayable($request->validated());

        return response()->json([
            'data' => $accountsPayable,
            'message' => 'បានបង្កើតវិក្កយបត្រត្រូវទូទាត់ដោយជោគជ័យ',
        ]);
    }

    // SHOW
    public function show($id)
    {
        return $this->accountsPayableService->findById($id);
    }

    // UPDATE
    public function update(AccountsPayableRequest $request, $id)
    {
        $accountsPayable = $this->accountsPayableService
            ->updateAccountsPayable($request->validated(), $id);

        return response()->json([
            'data' => $accountsPayable,
            'message' => 'បានកែប្រែវិក្កយបត្រត្រូវទូទាត់ដោយជោគជ័យ',
        ]);
    }

    // DELETE
    public function destroy($id)
    {
        try {
            $accountsPayable = $this->accountsPayableService->deleteAccountsPayable($id);

            return response()->json([
                'data' => $accountsPayable,
                'message' => 'បានលុបវិក្កយបត្រត្រូវទូទាត់ដោយជោគជ័យ',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    // CHANGE STATUS
    public function changeStatus(Request $request, $id)
    {
        $accountsPayable = $this->accountsPayableService
            ->changeStatus($id, $request->status);

        return response()->json([
            'data' => $accountsPayable,
            'message' => 'បានប្តូរស្ថានភាពដោយជោគជ័យ',
        ]);
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        // លុបបានតែវិក្កយបត្រណាដែលមិនទាន់មានការបង់ប្រាក់ (paid_amount == 0)
        AccountsPayable::whereIn('id', $request->ids)
            ->where('paid_amount', 0)
            ->delete();

        return response()->json([
            'message' => 'លុបវិក្កយបត្រដែលជ្រើសរើសជោគជ័យ (ប្រព័ន្ធនឹងរំលងវិក្កយបត្រដែលមានទិន្នន័យទូទាត់)',
        ]);
    }

    // DELETE ALL
    public function deleteAll()
    {
        AccountsPayable::where('paid_amount', 0)->delete();

        return response()->json([
            'message' => 'លុបវិក្កយបត្រទាំងអស់ដែលមិនទាន់ទូទាត់ជោគជ័យ',
        ]);
    }
}
