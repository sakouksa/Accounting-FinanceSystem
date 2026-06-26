<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'payment_no',
        'payment_type',
        'payable_id',
        'receivable_id',
        'payment_date',
        'payment_method_id',
        'currency_code',
        'exchange_rate',
        'amount',
        'reference_no',
        'transaction_id',
        'status',
        'recorded_by',
        'remarks',
    ];

    // relation to transaction
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    // relation to accounts payable (for purchase payment)
    public function accountsPayable()
    {
        return $this->belongsTo(AccountsPayable::class, 'payable_id');
    }

    // relation to accounts receivable (for sales receipt)
    public function accountsReceivable()
    {
        return $this->belongsTo(AccountsReceivable::class, 'receivable_id');
    }

    // relation to payment method
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }

    // relation to payment method
    public function recorder()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
