<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountsReceivable extends Model
{
    protected $table = 'accounts_receivable';

    protected $fillable = [
        'customer_id',
        'invoice_no',
        'invoice_date',
        'due_date',
        'total_amount',
        'paid_amount',
        'balance_amount',
        'status',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    // relation to payment
    public function payments()
    {
        return $this->hasMany(Payment::class, 'receivable_id');
    }
}