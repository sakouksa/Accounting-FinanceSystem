<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'transaction_no',
        'transaction_date',
        'transaction_type_id',
        'reference_type',
        'reference_id',
        'branch_id',
        'currency_code',
        'exchange_rate',
        'total_debit',
        'total_credit',
        'description',
        'status',
        'approved_by',
        'approved_at',
        'created_by',
    ];

    public function details()
    {
        return $this->hasMany(TransactionDetail::class);
    }

    public function cashFlows()
    {
        return $this->hasMany(CashFlow::class, 'transaction_id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function transactionType()
    {
        return $this->belongsTo(TransactionType::class, 'transaction_type_id');
    }

    // relation to payment
    public function payment()
    {
        return $this->hasOne(Payment::class, 'transaction_id');
    }
}