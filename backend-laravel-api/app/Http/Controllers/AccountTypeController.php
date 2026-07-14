<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccountTypeRequest;
use App\Services\AccountTypeService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class AccountTypeController extends Controller implements HasMiddleware
{
    protected $accountTypeService;

    public function __construct(AccountTypeService $accountTypeService)
    {
        $this->accountTypeService = $accountTypeService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:account_types.read', only: ['index', 'show', 'stats']),
            new Middleware('permission:account_types.create', only: ['store']),
            new Middleware('permission:account_types.update', only: ['update']),
            new Middleware('permission:account_types.delete', only: ['destroy', 'bulkDelete', 'deleteAll']),
        ];
    }

    // LIST
    public function index(Request $request)
    {
        $paginator = $this->accountTypeService->getAll($request);

        return $this->paginatedResponse(
            $paginator->items(),
            $paginator->total()
        );
    }

    // STATS
    public function stats()
    {
        $stats = $this->accountTypeService->getStats();
        return response()->json([
            'stats' => $stats
        ]);
    }

    // STORE
    public function store(AccountTypeRequest $request)
    {
        $accountType = $this->accountTypeService->createAccountType($request->validated());

        return $this->successResponse($accountType, 'បានបង្កើត Account Type ជោគជ័យ', 201);
    }

    // SHOW
    public function show(string $id)
    {
        $accountType = $this->accountTypeService->findById($id);
        return $this->successResponse($accountType);
    }

    // UPDATE
    public function update(AccountTypeRequest $request, string $id)
    {
        $accountType = $this->accountTypeService->updateAccountType($request->validated(), $id);

        return $this->successResponse($accountType, 'បានកែប្រែ Account Type ជោគជ័យ');
    }

    // DELETE
    public function destroy(string $id)
    {
        try {
            $accountType = $this->accountTypeService->deleteAccountType($id);
            return $this->successResponse($accountType, 'បានលុបជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse('លុបមិនបានជោគជ័យ: '.$e->getMessage(), 400);
        }
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:account_types,id',
        ]);

        $this->accountTypeService->bulkDelete($request->ids);

        return $this->successResponse(null, 'លុបជាច្រើនជោគជ័យ');
    }

    public function deleteAll()
    {
        $this->accountTypeService->deleteAll();

        return $this->successResponse(null, 'លុបទាំងអស់ជោគជ័យ');
    }
}
