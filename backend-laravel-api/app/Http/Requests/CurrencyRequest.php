<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CurrencyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $currencyId = $this->route('currency');

        if ($currencyId instanceof \App\Models\Currency) {
            $currencyId = $currencyId->id;
        }

        return [
            'code' => [
                'sometimes',
                'required',
                'string',
                'max:10',
                Rule::unique('currencies', 'code')->ignore($currencyId),
            ],

            'name' => ['sometimes', 'required', 'string', 'max:100'],

            'symbol' => ['nullable', 'string', 'max:10'],

            'exchange_rate' => ['nullable', 'numeric'],

            'status' => ['sometimes', 'required', 'in:active,inactive'],
        ];
    }
}