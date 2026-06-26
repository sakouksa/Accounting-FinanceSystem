<?php

namespace App\Repositories;

use App\Models\AccountsPayable;
use App\Models\AccountsReceivable;
use App\Models\Payment;
use Exception;
use Illuminate\Support\Facades\DB;

class PaymentRepository
{
    /**
     * LIST + FILTER + PAGINATION
     */
    public function getPaginatedList(array $filters, $limit = 10)
    {
        $query = Payment::with([
            'accountsPayable.supplier',
            'accountsReceivable.customer',
            'paymentMethod:id,name',
            'recorder:id,username',
            'transaction:id,transaction_no',
        ]);

        if (! empty($filters['txt_search'])) {
            $search = $filters['txt_search'];

            $query->where(function ($q) use ($search) {
                $q->where('payment_no', 'LIKE', "%{$search}%")
                    ->orWhere('reference_no', 'LIKE', "%{$search}%");
            });
        }

        if (! empty($filters['from_date']) && ! empty($filters['to_date'])) {
            $query->whereBetween('payment_date', [
                $filters['from_date'],
                $filters['to_date'],
            ]);
        }

        if (! empty($filters['payment_type'])) {
            $query->where('payment_type', $filters['payment_type']);
        }

        if (! empty($filters['payment_method_id'])) {
            $query->where('payment_method_id', $filters['payment_method_id']);
        }

        if (! empty($filters['payable_id'])) {
            $query->where('payable_id', $filters['payable_id']);
        }

        if (! empty($filters['receivable_id'])) {
            $query->where('receivable_id', $filters['receivable_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query
            ->orderBy('id', 'desc')
            ->paginate($limit);
    }

    /**
     * STATS
     */
    public function getStats()
    {
        $statusCounts = Payment::selectRaw("
            COUNT(CASE WHEN status = 'pending' THEN 1 END) as total_unpaid,
            COUNT(CASE WHEN status = 'partial' THEN 1 END) as total_partial,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as total_paid
        ")->first();

        $amounts = Payment::where('status', 'completed')
            ->selectRaw("
                SUM(CASE WHEN payment_type = 'receivable' THEN amount ELSE 0 END) as sum_receivable,
                SUM(CASE WHEN payment_type = 'payable' THEN amount ELSE 0 END) as sum_payable
            ")
            ->first();

        $sumBalance =
            ($amounts->sum_receivable ?? 0)
            - ($amounts->sum_payable ?? 0);

        return [
            'total_unpaid' => (int) ($statusCounts->total_unpaid ?? 0),
            'total_partial' => (int) ($statusCounts->total_partial ?? 0),
            'total_paid' => (int) ($statusCounts->total_paid ?? 0),
            'sum_balance' => (float) $sumBalance,
        ];
    }

    /**
     * SHOW
     */
    public function findById($id)
    {
        return Payment::with([
            'accountsPayable.supplier',
            'accountsReceivable.customer',
            'paymentMethod:id,name',
            'recorder:id,username',
            'transaction:id,transaction_no',
        ])->findOrFail($id);
    }

    /**
     * STORE
     */
    public function createPayment(array $data)
    {
        return DB::transaction(function () use ($data) {

            $data['recorded_by'] = auth()->id();

            $payment = Payment::create($data);

            if ($payment->status === 'completed') {
                $this->syncInvoiceBalances($payment);
            }

            return $payment;
        });
    }

    /**
     * UPDATE
     */
    public function updatePayment(array $data, $id)
    {
        return DB::transaction(function () use ($data, $id) {

            $payment = Payment::findOrFail($id);

            $oldPayableId = $payment->payable_id;
            $oldReceivableId = $payment->receivable_id;
            $oldStatus = $payment->status;

            $data['recorded_by'] = auth()->id();

            $payment->update($data);

            if ($oldStatus === 'completed') {

                if ($oldPayableId) {
                    $this->recalculatePayable($oldPayableId);
                }

                if ($oldReceivableId) {
                    $this->recalculateReceivable($oldReceivableId);
                }
            }

            $this->syncInvoiceBalances($payment);

            return $payment;
        });
    }

    /**
     * DELETE
     */
    public function deletePayment($id)
    {
        return DB::transaction(function () use ($id) {

            $payment = Payment::findOrFail($id);

            if ($payment->status === 'completed') {
                throw new Exception(
                    'មិនអាចលុបការទូទាត់នេះបានទេ ព្រោះវាមានស្ថានភាពរួចរាល់ (completed)។ សូមប្តូរស្ថានភាពទៅ cancelled ឬ pending សិន។'
                );
            }

            $payableId = $payment->payable_id;
            $receivableId = $payment->receivable_id;

            $payment->delete();

            if ($payableId) {
                $this->recalculatePayable($payableId);
            }

            if ($receivableId) {
                $this->recalculateReceivable($receivableId);
            }

            return $payment;
        });
    }

    /**
     * CHANGE STATUS
     */
    public function changeStatus($id, $status)
    {
        return DB::transaction(function () use ($id, $status) {

            $payment = Payment::findOrFail($id);

            $payment->status = $status;
            $payment->save();

            $this->syncInvoiceBalances($payment);

            return $payment;
        });
    }

    /**
     * BULK DELETE
     */
    public function bulkDelete(array $ids)
    {
        return Payment::whereIn('id', $ids)
            ->where('status', '!=', 'completed')
            ->delete();
    }

    /**
     * DELETE ALL
     */
    public function deleteAll()
    {
        return Payment::where('status', '!=', 'completed')
            ->delete();
    }

    /**
     * SYNC BALANCES
     */
    private function syncInvoiceBalances(Payment $payment)
    {
        if (
            $payment->payment_type === 'payable'
            && $payment->payable_id
        ) {
            $this->recalculatePayable($payment->payable_id);
        }

        if (
            $payment->payment_type === 'receivable'
            && $payment->receivable_id
        ) {
            $this->recalculateReceivable($payment->receivable_id);
        }
    }

    /**
     * RECALCULATE AP
     */
    private function recalculatePayable($payableId)
    {
        $invoice = AccountsPayable::findOrFail($payableId);

        $totalPaid = Payment::where('payable_id', $payableId)
            ->where('payment_type', 'payable')
            ->where('status', 'completed')
            ->sum('amount');

        $balance = $invoice->total_amount - $totalPaid;

        $status = 'unpaid';

        if ($totalPaid > 0) {
            $status = $balance <= 0
                ? 'paid'
                : 'partial';
        }

        $invoice->update([
            'paid_amount' => $totalPaid,
            'balance_amount' => $balance < 0 ? 0 : $balance,
            'status' => $status,
        ]);
    }

    /**
     * RECALCULATE AR
     */
    private function recalculateReceivable($receivableId)
    {
        $invoice = AccountsReceivable::findOrFail($receivableId);

        $totalPaid = Payment::where('receivable_id', $receivableId)
            ->where('payment_type', 'receivable')
            ->where('status', 'completed')
            ->sum('amount');

        $balance = $invoice->total_amount - $totalPaid;

        $status = 'unpaid';

        if ($totalPaid > 0) {
            $status = $balance <= 0
                ? 'paid'
                : 'partial';
        }

        $invoice->update([
            'paid_amount' => $totalPaid,
            'balance_amount' => $balance < 0 ? 0 : $balance,
            'status' => $status,
        ]);
    }
}
