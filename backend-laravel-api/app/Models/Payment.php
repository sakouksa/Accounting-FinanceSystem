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
        'payment_method',
        'currency_code',
        'exchange_rate',
        'amount',
        'reference_no',
        'transaction_id',
        'status',
        'recorded_by',
        'remarks'
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }
}