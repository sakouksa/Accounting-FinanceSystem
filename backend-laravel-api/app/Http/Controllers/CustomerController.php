<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Services\CustomerService;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    protected $customerService;

    public function __construct(CustomerService $customerService)
    {
        $this->customerService = $customerService;
    }

    // LIST
    public function index(Request $request)
    {
        $list = $this->customerService->getAll($request);

        return response()->json([
            'list' => $list,
            'total' => $list->count(),
        ]);
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

        return response()->json([
            'data' => $customer,
            'message' => 'បានបង្កើតអតិថិជនដោយជោគជ័យ',
        ]);
    }

    // SHOW
    public function show($id)
    {
        return $this->customerService->findById($id);
    }

    // UPDATE
    public function update(CustomerRequest $request, $id)
    {
        $customer = $this->customerService
            ->updateCustomer($request->validated(), $id);

        return response()->json([
            'data' => $customer,
            'message' => 'បានកែប្រែអតិថិជនដោយជោគជ័យ',
        ]);
    }

    // DELETE
    public function destroy($id)
    {
        try {
            $customer = $this->customerService
                ->deleteCustomer($id);

            return response()->json([
                'data' => $customer,
                'message' => 'បានលុបអតិថិជនដោយជោគជ័យ',
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
        $customer = $this->customerService
            ->changeStatus($id, $request->status);

        return response()->json([
            'data' => $customer,
            'message' => 'បានប្តូរស្ថានភាពដោយជោគជ័យ',
        ]);
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        $this->customerService->bulkDelete(
            $request->ids ?? []
        );

        return response()->json([
            'message' => 'លុបជោគជ័យ',
        ]);
    }

    // DELETE ALL
    public function deleteAll()
    {
        $this->customerService->deleteAll();

        return response()->json([
            'message' => 'លុបទាំងអស់ជោគជ័យ',
        ]);
    }
}
