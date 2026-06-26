<?php

namespace App\Http\Controllers;

use App\Http\Requests\CashFlowRequest;
use App\Models\ChartOfAccount;
use App\Models\Transaction;
use App\Services\CashFlowService;
use Illuminate\Http\Request;

class CashFlowController extends Controller
{
    protected $cashFlowService;

    public function __construct(CashFlowService $cashFlowService)
    {
        $this->cashFlowService = $cashFlowService;
    }

    // LIST
    public function index(Request $request)
    {
        $limit = $request->get('limit', 10);

        $paginator = $this->cashFlowService
            ->getPaginatedList($request->all(), $limit);

        return response()->json([
            'list' => $paginator->items(),
            'total' => $paginator->total(),
            'transactions' => Transaction::select(
                'id',
                'transaction_no'
            )->get(),
            'chart_of_accounts' => ChartOfAccount::select(
                'id',
                'account_name',
                'account_code'
            )->get(),
        ]);
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

        return response()->json([
            'data' => $cashFlow,
            'message' => 'បានបង្កើតទិន្នន័យលំហូរសាច់ប្រាក់ដោយជោគជ័យ',
        ]);
    }

    // SHOW
    public function show($id)
    {
        return $this->cashFlowService->findById($id);
    }

    // UPDATE
    public function update(CashFlowRequest $request, $id)
    {
        $cashFlow = $this->cashFlowService
            ->updateCashFlow($request->validated(), $id);

        return response()->json([
            'data' => $cashFlow,
            'message' => 'បានកែប្រែទិន្នន័យលំហូរសាច់ប្រាក់ដោយជោគជ័យ',
        ]);
    }

    // DELETE
    public function destroy($id)
    {
        try {
            $cashFlow = $this->cashFlowService
                ->deleteCashFlow($id);

            return response()->json([
                'data' => $cashFlow,
                'message' => 'បានលុបទិន្នន័យលំហូរសាច់ប្រាក់ដោយជោគជ័យ',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        $this->cashFlowService->bulkDelete(
            $request->get('ids', [])
        );

        return response()->json([
            'message' => 'លុបទិន្នន័យលំហូរសាច់ប្រាក់ដែលជ្រើសរើសជោគជ័យ',
        ]);
    }

    // DELETE ALL
    public function deleteAll()
    {
        $this->cashFlowService->deleteAll();

        return response()->json([
            'message' => 'លុបទិន្នន័យលំហូរសាច់ប្រាក់ទាំងអស់បានជោគជ័យ',
        ]);
    }
}
