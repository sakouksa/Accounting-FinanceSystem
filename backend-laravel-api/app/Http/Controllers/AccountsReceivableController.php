<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccountsReceivableRequest;
use App\Models\Customer;
use App\Services\AccountsReceivableService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class AccountsReceivableController extends Controller implements HasMiddleware
{
    protected $arService;

    public function __construct(AccountsReceivableService $arService)
    {
        $this->arService = $arService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:accounts_receivable.read', only: ['index', 'show', 'stats']),
            new Middleware('permission:accounts_receivable.create', only: ['store']),
            new Middleware('permission:accounts_receivable.update', only: ['update', 'changeStatus']),
            new Middleware('permission:accounts_receivable.delete', only: ['destroy', 'bulkDelete', 'deleteAll']),
        ];
    }

    // LIST
    public function index(Request $request)
    {
        $paginator = $this->arService->getAll($request);

        return $this->paginatedResponse(
            $paginator->items(),
            $paginator->total(),
            200,
            'Success',
            [
                'customers' => Customer::select('id', 'customer_name')->get()
            ]
        );
    }

    // STORE
    public function store(AccountsReceivableRequest $request)
    {
        $data = $this->arService->createAR($request->validated());

        return $this->successResponse($data, 'បានបង្កើត Accounts Receivable ដោយជោគជ័យ', 201);
    }

    // SHOW
    public function show($id)
    {
        $data = $this->arService->findById($id);
        return $this->successResponse($data);
    }

    // UPDATE
    public function update(AccountsReceivableRequest $request, $id)
    {
        $data = $this->arService->updateAR(
            $request->validated(),
            $id
        );

        return $this->successResponse($data, 'បានកែប្រែ Accounts Receivable ដោយជោគជ័យ');
    }

    // DELETE
    public function destroy($id)
    {
        $data = $this->arService->deleteAR($id);

        return $this->successResponse($data, 'បានលុប Accounts Receivable ដោយជោគជ័យ');
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

        return $this->successResponse($data, 'បានប្តូរស្ថានភាពដោយជោគជ័យ');
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:accounts_receivable,id',
        ]);

        $this->arService->bulkDelete($request->ids);

        return $this->successResponse(null, 'លុបជោគជ័យ');
    }

    // DELETE ALL
    public function deleteAll()
    {
        $this->arService->deleteAll();

        return $this->successResponse(null, 'លុបទាំងអស់ជោគជ័យ');
    }

    // STATS
    public function stats()
    {
        return response()->json([
            'stats' => $this->arService->getStats(),
        ]);
    }
}
