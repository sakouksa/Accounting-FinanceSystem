<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'name' => [
                'sometimes',
                'required',
                'string',
                'max:150',
            ],

            'account_name' => [
                'nullable',
                'string',
                'max:150',
            ],

            'account_number' => [
                'nullable',
                'string',
                'max:100',
            ],

            // qr image
            'qr_code' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'status' => [
                'sometimes',
                'required',
                'in:active,inactive',
            ],
        ];
    }
}
