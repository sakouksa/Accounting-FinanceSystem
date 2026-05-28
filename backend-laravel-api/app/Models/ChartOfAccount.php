<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChartOfAccount extends Model
{
    protected $fillable = [
        'account_type_id',
        'parent_account_id',
        'account_code',
        'account_name',
        'account_level',
        'normal_balance',
        'opening_balance',
        'current_balance',
        'currency_code',
        'is_system',
        'allow_transaction',
        'description',
        'status'
    ];

    public function accountType()
    {
        return $this->belongsTo(AccountType::class);
    }

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_account_id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_account_id');
    }
}