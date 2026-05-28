<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
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
        'notes'
    ];

    protected $casts = [
        'filters' => 'array'
    ];
}