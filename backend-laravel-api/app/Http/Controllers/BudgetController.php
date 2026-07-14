<?php

namespace App\Http\Controllers;

use App\Http\Requests\BudgetRequest;
use App\Models\Branch;
use App\Models\ChartOfAccount;
use App\Services\BudgetService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class BudgetController extends Controller implements HasMiddleware
{
    protected $budgetService;

    public function __construct(BudgetService $budgetService)
    {
        $this->budgetService = $budgetService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:budgets.read', only: ['index', 'show', 'stats']),
            new Middleware('permission:budgets.create', only: ['store']),
            new Middleware('permission:budgets.update', only: ['update', 'changeStatus']),
            new Middleware('permission:budgets.delete', only: ['destroy', 'bulkDelete', 'deleteAll']),
        ];
    }

    // LIST
    public function index(Request $request)
    {
        $limit = $request->get('limit', 10);

        $paginator = $this->budgetService
            ->getPaginatedList($request->all(), $limit);

        return response()->json([
            'list' => $paginator->items(),
            'total' => $paginator->total(),
            'accounts' => ChartOfAccount::select('id', 'account_name')->get(),
            'branches' => Branch::select('id', 'name')->get(),
        ]);
    }

    // STATS
    public function stats()
    {
        return response()->json([
            'stats' => $this->budgetService->getStats(),
        ]);
    }

    // STORE
    public function store(BudgetRequest $request)
    {
        $budget = $this->budgetService
            ->createBudget($request->validated());

        return response()->json([
            'data' => $budget,
            'message' => 'បានបង្កើតថវិកាដោយជោគជ័យ',
        ]);
    }

    // SHOW
    public function show($id)
    {
        return $this->budgetService->findById($id);
    }

    // UPDATE
    public function update(BudgetRequest $request, $id)
    {
        $budget = $this->budgetService
            ->updateBudget($request->validated(), $id);

        return response()->json([
            'data' => $budget,
            'message' => 'បានកែប្រែថវិកាដោយជោគជ័យ',
        ]);
    }

    // DELETE
    public function destroy($id)
    {
        $budget = $this->budgetService
            ->deleteBudget($id);

        return response()->json([
            'data' => $budget,
            'message' => 'បានលុបថវិកាដោយជោគជ័យ',
        ]);
    }

    // CHANGE STATUS
    public function changeStatus(Request $request, $id)
    {
        $budget = $this->budgetService
            ->changeStatus($id, $request->status);

        return response()->json([
            'data' => $budget,
            'message' => 'បានប្តូរស្ថានភាពដោយជោគជ័យ',
        ]);
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        $this->budgetService->bulkDelete(
            $request->ids ?? []
        );

        return response()->json([
            'message' => 'លុបជោគជ័យ',
        ]);
    }

    // DELETE ALL
    public function deleteAll()
    {
        $this->budgetService->deleteAll();

        return response()->json([
            'message' => 'លុបទាំងអស់ជោគជ័យ',
        ]);
    }
}
