<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    protected $fillable = [
        'budget_name',
        'fiscal_year',
        'account_id',
        'branch_id',
        'allocated_amount',
        'used_amount',
        'remaining_amount',
        'start_date',
        'end_date',
        'status',
        'created_by'
    ];

    public function account()
    {
        return $this->belongsTo(ChartOfAccount::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}