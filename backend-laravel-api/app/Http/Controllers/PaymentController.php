<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentRequest;
use App\Models\AccountsPayable;
use App\Models\AccountsReceivable;
use App\Models\PaymentMethod;
use App\Models\Transaction;
use App\Services\PaymentService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    // LIST
    public function index(Request $request)
    {
        $limit = $request->get('limit', 10);

        $paginator = $this->paymentService
            ->getPaginatedList($request->all(), $limit);

        return response()->json([
            'list' => $paginator->items(),
            'total' => $paginator->total(),
            'transaction' => Transaction::select(
                'id',
                'transaction_no'
            )->get(),
            'accounts_payable' => AccountsPayable::select(
                'id',
                'bill_no'
            )->get(),
            'accounts_receivable' => AccountsReceivable::select(
                'id',
                'invoice_no'
            )->get(),
            'payment_method' => PaymentMethod::select(
                'id',
                'name'
            )->where('status', 'active')->get(),
        ]);
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

        return response()->json([
            'data' => $payment,
            'message' => 'បានបង្កើតទិន្នន័យទូទាត់ប្រាក់ដោយជោគជ័យ',
        ]);
    }

    // SHOW
    public function show($id)
    {
        return $this->paymentService->findById($id);
    }

    // UPDATE
    public function update(PaymentRequest $request, $id)
    {
        $payment = $this->paymentService
            ->updatePayment($request->validated(), $id);

        return response()->json([
            'data' => $payment,
            'message' => 'បានកែប្រែទិន្នន័យទូទាត់ប្រាក់ដោយជោគជ័យ',
        ]);
    }

    // DELETE
    public function destroy($id)
    {
        try {
            $payment = $this->paymentService
                ->deletePayment($id);

            return response()->json([
                'data' => $payment,
                'message' => 'បានលុបទិន្នន័យទូទាត់ប្រាក់ដោយជោគជ័យ',
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
        try {
            $payment = $this->paymentService
                ->changeStatus($id, $request->status);

            return response()->json([
                'data' => $payment,
                'message' => 'បានប្តូរស្ថានភាពការទូទាត់ដោយជោគជ័យ',
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
        $this->paymentService->bulkDelete(
            $request->get('ids', [])
        );

        return response()->json([
            'message' => 'លុបការទូទាត់ដែលជ្រើសរើសជោគជ័យ (ប្រព័ន្ធនឹងរំលងរាល់ការទូទាត់ដែលមានស្ថានភាពរួចរាល់)',
        ]);
    }

    // DELETE ALL
    public function deleteAll()
    {
        $this->paymentService->deleteAll();

        return response()->json([
            'message' => 'លុបការទូទាត់ដែលមានស្ថានភាពមិនទាន់ជោគជ័យទាំងអស់បានជោគជ័យ (ប្រព័ន្ធនឹងរំលងរាល់ការទូទាត់ដែលមានស្ថានភាពរួចរាល់)',
        ]);
    }
}
