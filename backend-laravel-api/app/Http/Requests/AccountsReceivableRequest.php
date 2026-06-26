<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AccountsReceivableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('accounts_receivable'); // យក id ពី route resource

        return [
            'customer_id' => 'required|exists:customers,id',
            'invoice_no' => [
                'required',
                'string',
                'max:100',
                Rule::unique('accounts_receivable', 'invoice_no')->ignore($id),
            ],
            'invoice_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:invoice_date',
            'total_amount' => 'required|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'balance_amount' => 'nullable|numeric|min:0',
            'status' => 'required|in:unpaid,partial,paid',
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.required' => 'សូមជ្រើសរើសអតិថិជន',
            'customer_id.exists' => 'មិនមានអតិថិជននេះក្នុងប្រព័ន្ធឡើយ',
            'invoice_no.required' => 'សូមបញ្ចូលលេខវិក្កយបត្រ',
            'invoice_no.unique' => 'លេខវិក្កយបត្រនេះមានរួចហើយ',
            'invoice_date.required' => 'សូមជ្រើសរើសថ្ងៃចេញវិក្កយបត្រ',
            'due_date.required' => 'សូមជ្រើសរើសថ្ងៃកំណត់ទូទាត់',
            'due_date.after_or_equal' => 'ថ្ងៃកំណត់ទូទាត់ត្រូវតែស្មើ ឬក្រោយថ្ងៃចេញវិក្កយបត្រ',
            'total_amount.required' => 'សូមបញ្ចូលទឹកប្រាក់សរុប',
            'status.required' => 'សូមជ្រើសរើសស្ថានភាព',
            'status.in' => 'ស្ថានភាពត្រូវតែជា unpaid, partial ឬ paid',
        ];
    }
}
