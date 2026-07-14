<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentMethodRequest;
use App\Services\PaymentMethodService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PaymentMethodController extends Controller implements HasMiddleware
{
    protected $paymentMethodService;

    public function __construct(PaymentMethodService $paymentMethodService)
    {
        $this->paymentMethodService = $paymentMethodService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:payment_methods.read', only: ['index', 'show', 'stats']),
            new Middleware('permission:payment_methods.create', only: ['store']),
            new Middleware('permission:payment_methods.update', only: ['update', 'changeStatus']),
            new Middleware('permission:payment_methods.delete', only: ['destroy', 'bulkDelete', 'deleteAll']),
        ];
    }

    // LIST
    public function index(Request $request)
    {
        $paginator = $this->paymentMethodService->getAll($request);

        return $this->paginatedResponse(
            $paginator->items(),
            $paginator->total()
        );
    }

    // STATS
    public function stats()
    {
        $stats = $this->paymentMethodService->getStats();
        return response()->json([
            'stats' => $stats
        ]);
    }

    // STORE
    public function store(PaymentMethodRequest $request)
    {
        $data = $request->validated();

        // upload qr image
        if ($request->hasFile('qr_code')) {
            $file = $request->file('qr_code');
            $filename = time().'_'.$file->getClientOriginalName();
            $path = $file->storeAs('payment-methods', $filename, 'public');
            $data['qr_code'] = $path;
        }

        $paymentMethod = $this->paymentMethodService->createPaymentMethod($data);

        return $this->successResponse($paymentMethod, 'បានបង្កើតវិធីបង់ប្រាក់ដោយជោគជ័យ', 201);
    }

    // SHOW
    public function show(string $id)
    {
        $paymentMethod = $this->paymentMethodService->findById($id);
        return $this->successResponse($paymentMethod);
    }

    // UPDATE
    public function update(PaymentMethodRequest $request, string $id)
    {
        $paymentMethod = $this->paymentMethodService->findById($id);
        $data = $request->validated();

        // upload new qr image
        if ($request->hasFile('qr_code')) {
            // delete old image
            if ($paymentMethod->qr_code && Storage::disk('public')->exists($paymentMethod->qr_code)) {
                Storage::disk('public')->delete($paymentMethod->qr_code);
            }

            $file = $request->file('qr_code');
            $filename = time().'_'.$file->getClientOriginalName();
            $path = $file->storeAs('payment-methods', $filename, 'public');
            $data['qr_code'] = $path;
        }

        $updatedPaymentMethod = $this->paymentMethodService->updatePaymentMethod($data, $id);

        return $this->successResponse($updatedPaymentMethod, 'បានកែប្រែវិធីបង់ប្រាក់ដោយជោគជ័យ');
    }

    // DELETE
    public function destroy(string $id)
    {
        try {
            $paymentMethod = $this->paymentMethodService->deletePaymentMethod($id);
            return $this->successResponse($paymentMethod, 'បានលុបវិធីបង់ប្រាក់ដោយជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse('លុបមិនបានជោគជ័យ: '.$e->getMessage(), 400);
        }
    }

    // CHANGE STATUS
    public function changeStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $paymentMethod = $this->paymentMethodService->changeStatus($id, $request->input('status'));

        return $this->successResponse($paymentMethod, 'បានប្តូរស្ថានភាពដោយជោគជ័យ');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:payment_methods,id',
        ]);

        $this->paymentMethodService->bulkDelete($request->ids);

        return $this->successResponse(null, 'លុបជោគជ័យ');
    }

    public function deleteAll()
    {
        $this->paymentMethodService->deleteAll();

        return $this->successResponse(null, 'លុបទាំងអស់ជោគជ័យ');
    }
}
