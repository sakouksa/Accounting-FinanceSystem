<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialReport extends Model
{
    protected $fillable = [
        'report_type',
        'branch_id',
        'start_date',
        'end_date',
        'generated_by',
        'file_path',
        'generated_at'
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}