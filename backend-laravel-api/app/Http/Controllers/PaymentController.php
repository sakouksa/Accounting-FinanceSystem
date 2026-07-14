<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentRequest;
use App\Models\AccountsPayable;
use App\Models\AccountsReceivable;
use App\Models\PaymentMethod;
use App\Models\Transaction;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PaymentController extends Controller implements HasMiddleware
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:payments.read', only: ['index', 'show', 'stats']),
            new Middleware('permission:payments.create', only: ['store']),
            new Middleware('permission:payments.update', only: ['update', 'changeStatus']),
            new Middleware('permission:payments.delete', only: ['destroy', 'bulkDelete', 'deleteAll']),
        ];
    }

    // LIST
    public function index(Request $request)
    {
        $limit = $request->get('limit', 10);

        $paginator = $this->paymentService
            ->getPaginatedList($request->all(), $limit);

        return $this->paginatedResponse(
            $paginator->items(),
            $paginator->total(),
            200,
            'Success',
            [
                'transaction' => Transaction::select('id', 'transaction_no')->get(),
                'accounts_payable' => AccountsPayable::select('id', 'bill_no')->get(),
                'accounts_receivable' => AccountsReceivable::select('id', 'invoice_no')->get(),
                'payment_method' => PaymentMethod::select('id', 'name')->where('status', 'active')->get(),
            ]
        );
    }

    // STATS
    public function stats()
    {
        return response()->json([
            'stats' => $this->paymentService->getStats(),
        ]);
    }

    // STORE
    public function store(PaymentRequest $request)
    {
        $payment = $this->paymentService
            ->createPayment($request->validated());

        return $this->successResponse($payment, 'បានបង្កើតទិន្នន័យទូទាត់ប្រាក់ដោយជោគជ័យ', 201);
    }

    // SHOW
    public function show($id)
    {
        $payment = $this->paymentService->findById($id);
        return $this->successResponse($payment);
    }

    // UPDATE
    public function update(PaymentRequest $request, $id)
    {
        $payment = $this->paymentService
            ->updatePayment($request->validated(), $id);

        return $this->successResponse($payment, 'បានកែប្រែទិន្នន័យទូទាត់ប្រាក់ដោយជោគជ័យ');
    }

    // DELETE
    public function destroy($id)
    {
        try {
            $payment = $this->paymentService->deletePayment($id);
            return $this->successResponse($payment, 'បានលុបទិន្នន័យទូទាត់ប្រាក់ដោយជោគជ័យ');
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

        try {
            $payment = $this->paymentService
                ->changeStatus($id, $request->status);

            return $this->successResponse($payment, 'បានប្តូរស្ថានភាពការទូទាត់ដោយជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:payments,id',
        ]);

        $this->paymentService->bulkDelete(
            $request->get('ids', [])
        );

        return $this->successResponse(null, 'លុបការទូទាត់ដែលជ្រើសរើសជោគជ័យ (ប្រព័ន្ធនឹងរំលងរាល់ការទូទាត់ដែលមានស្ថានភាពរួចរាល់)');
    }

    // DELETE ALL
    public function deleteAll()
    {
        $this->paymentService->deleteAll();

        return $this->successResponse(null, 'លុបការទូទាត់ដែលមានស្ថានភាពមិនទាន់ជោគជ័យទាំងអស់បានជោគជ័យ (ប្រព័ន្ធនឹងរំលងរាល់ការទូទាត់ដែលមានស្ថានភាពរួចរាល់)');
    }
}
