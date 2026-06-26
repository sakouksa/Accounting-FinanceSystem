<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $table = 'reports';

    protected $fillable = [
        'report_name',
        'report_type',
        'report_date',
        'start_date',
        'end_date',
        'branch_id',
        'generated_by',
        'file_path',
        'file_format',
        'status',
        'filters',
        'notes',
    ];

    protected $casts = [
        'report_date' => 'date',
        'start_date' => 'date',
        'end_date' => 'date',
        'filters' => 'array',
    ];

    /**
     * Branch that owns this report
     */
    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    /**
     * User who generated the report
     */
    public function generator()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
