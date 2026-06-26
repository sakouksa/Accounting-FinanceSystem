<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'supplier_code',
        'supplier_name',
        'contact_person',
        'tax_number',
        'phone',
        'email',
        'address',
        'opening_balance',
        'current_balance',
        'status',
    ];

    // relation to accounts payable
    public function accountsPayables()
    {
        return $this->hasMany(AccountsPayable::class, 'supplier_id');
    }
}
