<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CashFlow extends Model
{
    protected $fillable = [
        'transaction_id',
        'flow_date',
        'flow_type',
        'account_id',
        'amount',
        'description',
    ];

    /**
     * Relationship CashFlow transaction
     */
    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'transaction_id');
    }

    /**
     * relationship CashFlow account
     */
    public function account()
    {
        return $this->belongsTo(ChartOfAccount::class, 'account_id');
    }
}
