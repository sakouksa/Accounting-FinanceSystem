<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('supplier');

        return [
            'supplier_code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('suppliers', 'supplier_code')->ignore($id),
            ],

            'supplier_name' => 'required|string|max:150',

            'contact_person' => 'nullable|string|max:150',

            'tax_number' => 'nullable|string|max:100',

            'phone' => 'nullable|string|max:30',

            'email' => [
                'nullable',
                'email',
                'max:150',
                Rule::unique('suppliers', 'email')->ignore($id),
            ],

            'address' => 'nullable|string',

            'opening_balance' => 'nullable|numeric',
            'current_balance' => 'nullable|numeric',

            'status' => 'required|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'supplier_code.required' => 'សូមបញ្ចូល Supplier Code',
            'supplier_code.unique' => 'Supplier Code មានរួចហើយ',

            'supplier_name.required' => 'សូមបញ្ចូលឈ្មោះ Supplier',

            'email.email' => 'Email មិនត្រឹមត្រូវ',
            'email.unique' => 'Email មានអ្នកប្រើរួចហើយ',

            'status.required' => 'សូមជ្រើសរើសស្ថានភាព',
            'status.in' => 'ស្ថានភាពត្រូវជា Active ឬ Inactive',
        ];
    }
}
