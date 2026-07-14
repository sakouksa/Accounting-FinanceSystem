<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccountsPayableRequest;
use App\Models\Supplier;
use App\Services\AccountsPayableService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class AccountsPayableController extends Controller implements HasMiddleware
{
    protected $accountsPayableService;

    public function __construct(AccountsPayableService $accountsPayableService)
    {
        $this->accountsPayableService = $accountsPayableService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:accounts_payable.read', only: ['index', 'show', 'stats']),
            new Middleware('permission:accounts_payable.create', only: ['store']),
            new Middleware('permission:accounts_payable.update', only: ['update', 'changeStatus']),
            new Middleware('permission:accounts_payable.delete', only: ['destroy', 'bulkDelete', 'deleteAll']),
        ];
    }

    // LIST
    public function index(Request $request)
    {
        $paginator = $this->accountsPayableService->getAll($request);

        return $this->paginatedResponse(
            $paginator->items(),
            $paginator->total(),
            200,
            'Success',
            [
                'suppliers' => Supplier::select('id', 'supplier_name')->get()
            ]
        );
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

        return $this->successResponse($accountsPayable, 'បានបង្កើតវិក្កយបត្រត្រូវទូទាត់ដោយជោគជ័យ', 201);
    }

    // SHOW
    public function show($id)
    {
        $accountsPayable = $this->accountsPayableService->findById($id);
        return $this->successResponse($accountsPayable);
    }

    // UPDATE
    public function update(AccountsPayableRequest $request, $id)
    {
        $accountsPayable = $this->accountsPayableService
            ->updateAccountsPayable($request->validated(), $id);

        return $this->successResponse($accountsPayable, 'បានកែប្រែវិក្កយបត្រត្រូវទូទាត់ដោយជោគជ័យ');
    }

    // DELETE
    public function destroy($id)
    {
        try {
            $accountsPayable = $this->accountsPayableService->deleteAccountsPayable($id);
            return $this->successResponse($accountsPayable, 'បានលុបវិក្កយបត្រត្រូវទូទាត់ដោយជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse('លុបមិនបានជោគជ័យ: '.$e->getMessage(), 400);
        }
    }

    // CHANGE STATUS
    public function changeStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:unpaid,partial,paid',
        ]);

        $accountsPayable = $this->accountsPayableService
            ->changeStatus($id, $request->status);

        return $this->successResponse($accountsPayable, 'បានប្តូរស្ថានភាពដោយជោគជ័យ');
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:accounts_payable,id',
        ]);

        $this->accountsPayableService->bulkDelete($request->ids);

        return $this->successResponse(null, 'លុបវិក្កយបត្រដែលជ្រើសរើសជោគជ័យ (ប្រព័ន្ធនឹងរំលងវិក្កយបត្រដែលមានទិន្នន័យទូទាត់)');
    }

    // DELETE ALL
    public function deleteAll()
    {
        $this->accountsPayableService->deleteAll();

        return $this->successResponse(null, 'លុបវិក្កយបត្រទាំងអស់ដែលមិនទាន់ទូទាត់ជោគជ័យ');
    }
}
