<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('payment');

        return [
            'payment_no' => [
                'required',
                'string',
                'max:100',
                Rule::unique('payments', 'payment_no')->ignore($id),
            ],
            'payment_type' => 'required|in:payable,receivable',

            // បើប្រភេទជា payable ត្រូវមានក្នុង accounts_payable, បើ receivable ត្រូវមានក្នុង accounts_receivable
            'payable_id' => 'required_if:payment_type,payable|nullable|integer|exists:accounts_payable,id',
            'receivable_id' => 'required_if:payment_type,receivable|nullable|integer|exists:accounts_receivable,id',

            'payment_date' => 'required|date',
            'payment_method_id' => 'required|integer|exists:payment_methods,id',

            'currency_code' => 'nullable|string|max:10',
            'exchange_rate' => 'nullable|numeric|min:0',
            'amount' => 'required|numeric|min:0',

            'reference_no' => 'nullable|string|max:100',
            'transaction_id' => 'nullable|integer|exists:transactions,id',
            'status' => 'required|in:pending,completed,cancelled',
            'recorded_by' => 'nullable|integer|exists:users,id',
            'remarks' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'payment_no.required' => 'សូមបញ្ចូលលេខបញ្ជាក់ការទូទាត់',
            'payment_no.unique' => 'លេខបញ្ជាក់ការទូទាត់នេះត្រូវបានប្រើប្រាស់រួចហើយ',
            'payment_type.required' => 'សូមជ្រើសរើសប្រភេទនៃការទូទាត់',
            'payable_id.required_if' => 'សូមជ្រើសរើសវិក្កយបត្រត្រូវទូទាត់ (Payable)',
            'receivable_id.required_if' => 'សូមជ្រើសរើសវិក្កយបត្រត្រូវប្រមូល (Receivable)',
            'payment_date.required' => 'សូមជ្រើសរើសកាលបរិច្ឆេទប្រាក់ទូទាត់',
            'payment_method.required' => 'សូមជ្រើសរើសវិធីសាស្ត្រទូទាត់ប្រាក់',
            'amount.required' => 'សូមបញ្ចូលទឹកប្រាក់ទូទាត់',
            'amount.numeric' => 'ទឹកប្រាក់ទូទាត់ត្រូវតែជាលេខ',
            'status.required' => 'សូមជ្រើសរើសស្ថានភាព',
        ];
    }
}
