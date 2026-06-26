<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CashFlowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'transaction_id' => 'nullable|integer|exists:transactions,id',
            'flow_date' => 'required|date',
            'flow_type' => 'required|in:inflow,outflow',
            'account_id' => 'required|integer|exists:chart_of_accounts,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'flow_date.required' => 'សូមជ្រើសរើសកាលបរិច្ឆេទលំហូរសាច់ប្រាក់',
            'flow_type.required' => 'សូមជ្រើសរើសប្រភេទលំហូរសាច់ប្រាក់ (Inflow/Outflow)',
            'flow_type.in' => 'ប្រភេទលំហូរសាច់ប្រាក់មិនត្រឹមត្រូវ',
            'account_id.required' => 'សូមជ្រើសរើសគណនី (Chart of Account)',
            'account_id.exists' => 'មិនមានគណនីនេះក្នុងប្រព័ន្ធទេ',
            'amount.required' => 'សូមបញ្ចូលទឹកប្រាក់',
            'amount.numeric' => 'ទឹកប្រាក់ត្រូវតែជាលេខ',
            'amount.min' => 'ទឹកប្រាក់មិនអាចតូចជាង ០ បានទេ',
        ];
    }
}
