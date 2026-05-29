<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChartOfAccount extends Model
{
    protected $table = 'chart_of_accounts';

    protected $primaryKey = 'id';

    public $timestamps = true;

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
        'status',
    ];

    protected $casts = [
        'opening_balance' => 'decimal:2',
        'current_balance' => 'decimal:2',
        'is_system' => 'boolean',
        'allow_transaction' => 'boolean',
        'account_level' => 'integer',
    ];

    // === កែ Relation នេះ ===
    public function accountType()
    {
        return $this->belongsTo(AccountType::class, 'account_type_id', 'id');
    }

    public function parent()
    {
        return $this->belongsTo(ChartOfAccount::class, 'parent_account_id', 'id');
    }
}
