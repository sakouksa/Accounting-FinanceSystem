<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChartOfAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('chart_of_account') ?? $this->route('id');

        return [
            'account_type_id' => 'required|exists:account_types,id',   // ← កែជា 'id'

            'parent_account_id' => [
                'nullable',
                'exists:chart_of_accounts,id',
                Rule::notIn([$id]),
            ],

            'account_code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('chart_of_accounts', 'account_code')->ignore($id),
            ],

            'account_name' => 'required|string|max:150',
            'account_level' => 'nullable|integer|min:1',
            'normal_balance' => 'required|in:Debit,Credit',
            'opening_balance' => 'nullable|numeric|min:0',
            'current_balance' => 'nullable|numeric',
            'currency_code' => 'nullable|string|max:10',
            'is_system' => 'boolean',
            'allow_transaction' => 'boolean',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:Active,Inactive',
        ];
    }
}
