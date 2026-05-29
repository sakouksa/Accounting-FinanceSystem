<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountType extends Model
{
    protected $table = 'account_types';

    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $fillable = ['name', 'code', 'normal_balance', 'description'];

    public function accounts()
    {
        return $this->hasMany(ChartOfAccount::class);
    }
}
