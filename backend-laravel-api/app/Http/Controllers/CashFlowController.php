<?php

namespace App\Http\Controllers;

use App\Http\Requests\CashFlowRequest;
use App\Models\ChartOfAccount;
use App\Models\Transaction;
use App\Services\CashFlowService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CashFlowController extends Controller implements HasMiddleware
{
    protected $cashFlowService;

    public function __construct(CashFlowService $cashFlowService)
    {
        $this->cashFlowService = $cashFlowService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:cash_flows.read', only: ['index', 'show', 'stats']),
            new Middleware('permission:cash_flows.create', only: ['store']),
            new Middleware('permission:cash_flows.update', only: ['update']),
            new Middleware('permission:cash_flows.delete', only: ['destroy', 'bulkDelete', 'deleteAll']),
        ];
    }

    // LIST
    public function index(Request $request)
    {
        $limit = $request->get('limit', 10);

        $paginator = $this->cashFlowService
            ->getPaginatedList($request->all(), $limit);

        return $this->paginatedResponse(
            $paginator->items(),
            $paginator->total(),
            200,
            'Success',
            [
                'transactions' => Transaction::select('id', 'transaction_no')->get(),
                'chart_of_accounts' => ChartOfAccount::select('id', 'account_name', 'account_code')->get(),
            ]
        );
    }

    // STATS
    public function stats()
    {
        return response()->json([
            'stats' => $this->cashFlowService->getStats(),
        ]);
    }

    // STORE
    public function store(CashFlowRequest $request)
    {
        $cashFlow = $this->cashFlowService
            ->createCashFlow($request->validated());

        return $this->successResponse($cashFlow, 'បានបង្កើតទិន្នន័យលំហូរសាច់ប្រាក់ដោយជោគជ័យ', 201);
    }

    // SHOW
    public function show($id)
    {
        $cashFlow = $this->cashFlowService->findById($id);
        return $this->successResponse($cashFlow);
    }

    // UPDATE
    public function update(CashFlowRequest $request, $id)
    {
        $cashFlow = $this->cashFlowService
            ->updateCashFlow($request->validated(), $id);

        return $this->successResponse($cashFlow, 'បានកែប្រែទិន្នន័យលំហូរសាច់ប្រាក់ដោយជោគជ័យ');
    }

    // DELETE
    public function destroy($id)
    {
        try {
            $cashFlow = $this->cashFlowService
                ->deleteCashFlow($id);
            return $this->successResponse($cashFlow, 'បានលុបទិន្នន័យលំហូរសាច់ប្រាក់ដោយជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse('លុបមិនបានជោគជ័យ: '.$e->getMessage(), 400);
        }
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:cash_flows,id',
        ]);

        $this->cashFlowService->bulkDelete(
            $request->get('ids', [])
        );

        return $this->successResponse(null, 'លុបទិន្នន័យលំហូរសាច់ប្រាក់ដែលជ្រើសរើសជោគជ័យ');
    }

    // DELETE ALL
    public function deleteAll()
    {
        $this->cashFlowService->deleteAll();

        return $this->successResponse(null, 'លុបទិន្នន័យលំហូរសាច់ប្រាក់ទាំងអស់បានជោគជ័យ');
    }
}
