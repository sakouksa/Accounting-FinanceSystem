<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('transaction') ?? $this->route('id');

        return [
            'transaction_no' => [
                'required',
                'string',
                'max:50',
                Rule::unique('transactions', 'transaction_no')->ignore($id),
            ],

            'transaction_date' => 'required|date',

            'transaction_type' => 'required|string|max:50',

            'reference_type' => 'nullable|string|max:100',

            'reference_id' => 'nullable|integer',

            'branch_id' => 'required|exists:branches,id',

            'currency_code' => 'required|string|max:10',

            'exchange_rate' => 'nullable|numeric|min:0',

            'total_debit' => 'required|numeric|min:0',

            'total_credit' => 'required|numeric|min:0',

            'description' => 'nullable|string',

            'status' => 'sometimes|in:Pending,Approved,Cancelled',

            'approved_by' => 'nullable|exists:users,id',

            'approved_at' => 'nullable|date',

            'created_by' => 'nullable|exists:users,id',
        ];
    }
}
