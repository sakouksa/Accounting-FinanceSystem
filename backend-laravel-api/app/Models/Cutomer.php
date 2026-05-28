<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'customer_code',
        'customer_name',
        'customer_type',
        'tax_number',
        'phone',
        'email',
        'address',
        'credit_limit',
        'opening_balance',
        'current_balance',
        'status'
    ];
}