<?php

namespace App\Http\Controllers;

use App\Http\Requests\BranchRequest;
use App\Services\BranchService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class BranchController extends Controller implements HasMiddleware
{
    protected $branchService;

    public function __construct(BranchService $branchService)
    {
        $this->branchService = $branchService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:branches.read', only: ['index', 'show', 'stats']),
            new Middleware('permission:branches.create', only: ['store']),
            new Middleware('permission:branches.update', only: ['update', 'changeStatus']),
            new Middleware('permission:branches.delete', only: ['destroy', 'bulkDelete', 'deleteAll']),
        ];
    }

    // LIST
    public function index(Request $request)
    {
        $paginator = $this->branchService->getAll($request);

        return $this->paginatedResponse(
            $paginator->items(),
            $paginator->total()
        );
    }

    // STATS
    public function stats()
    {
        $stats = $this->branchService->getStats();
        return response()->json([
            'stats' => $stats
        ]);
    }

    // STORE
    public function store(BranchRequest $request)
    {
        $branch = $this->branchService->createBranch($request->validated());

        return $this->successResponse($branch, 'បានបង្កើតសាខាថ្មីដោយជោគជ័យ', 201);
    }

    // SHOW
    public function show(string $id)
    {
        $branch = $this->branchService->findById($id);
        return $this->successResponse($branch);
    }

    // UPDATE
    public function update(BranchRequest $request, string $id)
    {
        $branch = $this->branchService->updateBranch($request->validated(), $id);

        return $this->successResponse($branch, 'បានកែប្រែសាខាដោយជោគជ័យ');
    }

    // DELETE
    public function destroy(string $id)
    {
        try {
            $branch = $this->branchService->deleteBranch($id);
            return $this->successResponse($branch, 'បានលុបសាខាដោយជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse('លុបមិនបានជោគជ័យ: '.$e->getMessage(), 400);
        }
    }

    // CHANGE STATUS
    public function changeStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $branch = $this->branchService->changeStatus($id, $request->input('status'));

        return $this->successResponse($branch, 'បានប្តូរស្ថានភាពដោយជោគជ័យ');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:branches,id',
        ]);

        $this->branchService->bulkDelete($request->ids);

        return $this->successResponse(null, 'លុបជោគជ័យ');
    }

    public function deleteAll()
    {
        $this->branchService->deleteAll();

        return $this->successResponse(null, 'លុបទាំងអស់ជោគជ័យ');
    }
}