<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AccountsPayableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('accounts_payable');

        return [
            'supplier_id' => 'required|integer|exists:suppliers,id',

            'bill_no' => [
                'required',
                'string',
                'max:50',
                Rule::unique('accounts_payable', 'bill_no')->ignore($id),
            ],

            'bill_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:bill_date',

            'total_amount' => 'required|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'balance_amount' => 'nullable|numeric|min:0',

            'status' => 'required|in:unpaid,partial,paid',
        ];
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'supplier_id.required' => 'សូមជ្រើសរើសអ្នកផ្គត់ផ្គង់',
            'supplier_id.exists' => 'មិនមានអ្នកផ្គត់ផ្គង់នេះក្នុងប្រព័ន្ធឡើយ',

            'bill_no.required' => 'សូមបញ្ចូលលេខវិក្កយបត្រ',
            'bill_no.unique' => 'លេខវិក្កយបត្រនេះត្រូវបានប្រើប្រាស់រួចហើយ',
            'bill_no.max' => 'លេខវិក្កយបត្រមិនអាចលើសពី 50 តួអក្សរ',

            'bill_date.required' => 'សូមជ្រើសរើសកាលបរិច្ឆេទវិក្កយបត្រ',
            'due_date.required' => 'សូមជ្រើសរើសថ្ងៃកំណត់ទូទាត់ប្រាក់',
            'due_date.after_or_equal' => 'ថ្ងៃកំណត់ទូទាត់ត្រូវតែស្មើ ឬក្រោយថ្ងៃវិក្កយបត្រ',

            'total_amount.required' => 'សូមបញ្ចូលទឹកប្រាក់សរុប',
            'total_amount.numeric' => 'ទឹកប្រាក់សរុបត្រូវតែជាលេខ',
            'total_amount.min' => 'ទឹកប្រាក់សរុបត្រូវតែធំជាង ឬស្មើ 0',

            'paid_amount.numeric' => 'ទឹកប្រាក់បានទូទាត់ត្រូវតែជាលេខ',
            'paid_amount.min' => 'ទឹកប្រាក់បានទូទាត់មិនអាចតូចជាង 0 ឡើយ',

            'balance_amount.numeric' => 'ទឹកប្រាក់នៅសល់ត្រូវតែជាលេខ',
            'balance_amount.min' => 'ទឹកប្រាក់នៅសល់មិនអាចតូចជាង 0 ឡើយ (សូមពិនិត្យមើលទឹកប្រាក់ទូទាត់ឡើងវិញ)',

            'status.required' => 'សូមជ្រើសរើសស្ថានភាព',
            'status.in' => 'ស្ថានភាពត្រូវតែជា Unpaid, Partial ឬ Paid',
        ];
    }
}
