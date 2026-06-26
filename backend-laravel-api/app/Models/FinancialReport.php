<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialReport extends Model
{
    protected $table = 'financial_reports';

    public $timestamps = false;

    protected $fillable = [
        'report_type',
        'branch_id',
        'start_date',
        'end_date',
        'generated_by',
        'file_path',
        'generated_at',
    ];

    protected $casts = [
        'file_paths' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'generated_at' => 'datetime',
    ];

    /**
     * Branch
     */
    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    /**
     * User who generated report
     */
    public function generator()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
