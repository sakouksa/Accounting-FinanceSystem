<?php

namespace App\Http\Requests;

use App\Models\TransactionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TransactionTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $transactionTypeId = $this->route('transaction_type');

        if ($transactionTypeId instanceof TransactionType) {
            $transactionTypeId = $transactionTypeId->id;
        }

        return [
            'code' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('transaction_types', 'code')->ignore($transactionTypeId),
            ],

            'name' => ['sometimes', 'required', 'string', 'max:100'],

            'description' => ['nullable', 'string'],

            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
