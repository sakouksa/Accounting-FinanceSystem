<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountsPayable extends Model
{
    protected $fillable = [
        'supplier_id',
        'bill_no',
        'bill_date',
        'due_date',
        'total_amount',
        'paid_amount',
        'balance_amount',
        'status'
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}