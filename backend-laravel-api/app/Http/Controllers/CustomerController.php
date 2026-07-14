<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Services\CustomerService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CustomerController extends Controller implements HasMiddleware
{
    protected $customerService;

    public function __construct(CustomerService $customerService)
    {
        $this->customerService = $customerService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:customers.read', only: ['index', 'show', 'stats']),
            new Middleware('permission:customers.create', only: ['store']),
            new Middleware('permission:customers.update', only: ['update', 'changeStatus']),
            new Middleware('permission:customers.delete', only: ['destroy', 'bulkDelete', 'deleteAll']),
        ];
    }

    // LIST
    public function index(Request $request)
    {
        $paginator = $this->customerService->getAll($request);

        return $this->paginatedResponse(
            $paginator->items(),
            $paginator->total()
        );
    }

    // STATS
    public function stats()
    {
        return response()->json([
            'stats' => $this->customerService->getStats(),
        ]);
    }

    // STORE
    public function store(CustomerRequest $request)
    {
        $customer = $this->customerService
            ->createCustomer($request->validated());

        return $this->successResponse($customer, 'បានបង្កើតអតិថិជនដោយជោគជ័យ', 201);
    }

    // SHOW
    public function show($id)
    {
        $customer = $this->customerService->findById($id);
        return $this->successResponse($customer);
    }

    // UPDATE
    public function update(CustomerRequest $request, $id)
    {
        $customer = $this->customerService
            ->updateCustomer($request->validated(), $id);

        return $this->successResponse($customer, 'បានកែប្រែអតិថិជនដោយជោគជ័យ');
    }

    // DELETE
    public function destroy($id)
    {
        try {
            $customer = $this->customerService
                ->deleteCustomer($id);
            return $this->successResponse($customer, 'បានលុបអតិថិជនដោយជោគជ័យ');
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

        $customer = $this->customerService
            ->changeStatus($id, $request->status);

        return $this->successResponse($customer, 'បានប្តូរស្ថានភាពដោយជោគជ័យ');
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:customers,id',
        ]);

        $this->customerService->bulkDelete(
            $request->ids ?? []
        );

        return $this->successResponse(null, 'លុបជោគជ័យ');
    }

    // DELETE ALL
    public function deleteAll()
    {
        $this->customerService->deleteAll();

        return $this->successResponse(null, 'លុបទាំងអស់ជោគជ័យ');
    }
}