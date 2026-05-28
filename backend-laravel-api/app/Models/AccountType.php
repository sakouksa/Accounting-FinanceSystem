<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountType extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'code',
        'normal_balance',
        'description',
    ];

    public function accounts()
    {
        return $this->hasMany(ChartOfAccount::class);
    }
}
