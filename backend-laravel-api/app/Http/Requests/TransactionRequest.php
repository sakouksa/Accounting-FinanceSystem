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
            'transaction_type_id' => 'required|exists:transaction_types,id',
            'reference_type' => 'nullable|string|max:100',
            'reference_id' => 'nullable|integer',
            'branch_id' => 'required|exists:branches,id',
            'currency_code' => 'required|in:USD,KHR,THB,CNY',
            'exchange_rate' => 'nullable|numeric|min:0',
            'total_debit' => 'required|numeric|min:0',
            'total_credit' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:draft,posted,cancelled',
            'approved_by' => 'nullable|exists:users,id',
            'approved_at' => 'nullable|date',
            'created_by' => 'nullable|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'transaction_no.required' => 'សូមបញ្ចូលលេខប្រតិបត្តិការ។',
            'transaction_no.string' => 'លេខប្រតិបត្តិការត្រូវតែជាអក្សរ។',
            'transaction_no.max' => 'លេខប្រតិបត្តិការមិនអាចលើសពី 50 តួអក្សរ។',
            'transaction_no.unique' => 'លេខប្រតិបត្តិការនេះមានរួចហើយ។',

            'transaction_date.required' => 'សូមជ្រើសរើសកាលបរិច្ឆេទ។',
            'transaction_date.date' => 'កាលបរិច្ឆេទមិនត្រឹមត្រូវ។',

            'transaction_type_id.required' => 'សូមជ្រើសរើសប្រភេទប្រតិបត្តិការ។',
            'transaction_type_id.exists' => 'ប្រភេទប្រតិបត្តិការដែលបានជ្រើសរើសមិនមានទេ។',

            'branch_id.required' => 'សូមជ្រើសរើសសាខា។',
            'branch_id.exists' => 'សាខាដែលបានជ្រើសរើសមិនមានទេ។',

            'currency_code.required' => 'សូមជ្រើសរើសរូបិយប័ណ្ណ។',
            'currency_code.in' => 'រូបិយប័ណ្ណត្រូវតែជា USD, KHR, THB ឬ CNY។',

            'exchange_rate.numeric' => 'អត្រាប្តូរប្រាក់ត្រូវតែជាលេខ។',
            'exchange_rate.min' => 'អត្រាប្តូរប្រាក់មិនអាចតិចជាង 0 បានទេ។',

            'total_debit.required' => 'សូមបញ្ចូលសរុប Debit។',
            'total_debit.numeric' => 'សរុប Debit ត្រូវតែជាលេខ។',
            'total_debit.min' => 'សរុប Debit មិនអាចតិចជាង 0 បានទេ។',

            'total_credit.required' => 'សូមបញ្ចូលសរុប Credit។',
            'total_credit.numeric' => 'សរុប Credit ត្រូវតែជាលេខ។',
            'total_credit.min' => 'សរុប Credit មិនអាចតិចជាង 0 បានទេ។',
        ];
    }
}
