<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChartOfAccountRequest;
use App\Services\ChartOfAccountService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ChartOfAccountController extends Controller implements HasMiddleware
{
    protected $coaService;

    public function __construct(ChartOfAccountService $coaService)
    {
        $this->coaService = $coaService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:chart_of_accounts.read', only: ['index', 'show', 'stats']),
            new Middleware('permission:chart_of_accounts.create', only: ['store']),
            new Middleware('permission:chart_of_accounts.update', only: ['update', 'changeStatus']),
            new Middleware('permission:chart_of_accounts.delete', only: ['destroy', 'bulkDelete', 'deleteAll']),
        ];
    }

    // LIST
    public function index(Request $request)
    {
        try {
            $paginator = $this->coaService->getAll($request);

            return $this->paginatedResponse(
                $paginator->items(),
                $paginator->total(),
                200,
                'Success',
                [
                    'account_types' => $this->coaService->getAccountTypesLookup(),
                    'parent_accounts' => $this->coaService->getParentAccountsLookup(),
                ]
            );
        } catch (\Exception $e) {
            \Log::error('ChartOfAccount Error: '.$e->getMessage());
            return $this->errorResponse('ទាញទិន្នន័យបរាជ័យ: '.$e->getMessage(), 500);
        }
    }

    // STATS
    public function stats()
    {
        $stats = $this->coaService->getStats();
        return response()->json(['stats' => $stats]);
    }

    // STORE
    public function store(ChartOfAccountRequest $request)
    {
        $data = $request->validated();

        $data['is_system'] = (bool) ($data['is_system'] ?? false);
        $data['allow_transaction'] = (bool) ($data['allow_transaction'] ?? true);
        $data['opening_balance'] = (float) ($data['opening_balance'] ?? 0);
        $data['current_balance'] = (float) ($data['current_balance'] ?? 0);
        $data['account_level'] = (int) ($data['account_level'] ?? 1);
        $data['parent_account_id'] = $data['parent_account_id'] ?? null;

        $account = $this->coaService->createChartOfAccount($data);

        return $this->successResponse($account->load(['accountType', 'parent']), 'បានបង្កើតគណនីដោយជោគជ័យ', 201);
    }

    // SHOW
    public function show(string $id)
    {
        $account = $this->coaService->findById($id);
        return $this->successResponse($account);
    }

    // UPDATE
    public function update(ChartOfAccountRequest $request, string $id)
    {
        try {
            $data = $request->validated();
            $data['is_system'] = (bool) ($data['is_system'] ?? false);
            $data['allow_transaction'] = (bool) ($data['allow_transaction'] ?? true);

            $account = $this->coaService->updateChartOfAccount($data, $id);

            return $this->successResponse($account->load(['accountType', 'parent']), 'កែប្រែជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse('កែប្រែបរាជ័យ: '.$e->getMessage(), 500);
        }
    }

    // DELETE
    public function destroy(string $id)
    {
        try {
            $account = $this->coaService->findById($id);

            if ($account->children()->count() > 0) {
                return $this->errorResponse('មិនអាចលុបគណនីដែលមានគណនីកូន', 400);
            }

            $this->coaService->deleteChartOfAccount($id);

            return $this->successResponse($account, 'លុបជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse('លុបមិនបានជោគជ័យ: '.$e->getMessage(), 400);
        }
    }

    // CHANGE STATUS
    public function changeStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string',
        ]);

        $account = $this->coaService->changeStatus($id, $request->status);

        return $this->successResponse($account, 'ប្តូរស្ថានភាពជោគជ័យ');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:chart_of_accounts,id',
        ]);

        $this->coaService->bulkDelete($request->ids);

        return $this->successResponse(null, 'លុបជោគជ័យ');
    }

    public function deleteAll()
    {
        $this->coaService->deleteAll();

        return $this->successResponse(null, 'លុបទាំងអស់ជោគជ័យ');
    }
}
