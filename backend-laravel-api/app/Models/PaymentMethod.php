<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    protected $fillable = [
        'name',
        'account_name',
        'account_number',
        'qr_code',
        'status',
    ];

    protected $appends = ['qr_code_url'];

    public function getQrCodeUrlAttribute()
    {
        return $this->qr_code ? asset('storage/'.$this->qr_code) : null;
    }

    // relation to payment
    public function payments()
    {
        return $this->hasMany(Payment::class, 'payment_method_id');
    }
}
