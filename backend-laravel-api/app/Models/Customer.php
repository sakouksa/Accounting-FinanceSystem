<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'status',
    ];

    public function accountsReceivable(): HasMany
    {
        return $this->hasMany(AccountsReceivable::class, 'customer_id', 'id');
    }
}
