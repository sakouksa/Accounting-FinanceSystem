<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('customer');

        return [
            'customer_code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('customers', 'customer_code')->ignore($id),
            ],

            'customer_name' => '|string|max:150',

            'customer_type' => 'required|in:retail,wholesale',

            'tax_number' => 'nullable|string|max:100',

            'phone' => 'nullable|string|max:30',

            'email' => [
                'required',
                'email',
                'max:150',
                Rule::unique('customers', 'email')->ignore($id),
            ],

            'address' => 'nullable|string',
            'credit_limit' => 'nullable|numeric',
            'opening_balance' => 'nullable|numeric',
            'current_balance' => 'nullable|numeric',

            'status' => 'required|in:active,inactive',
        ];
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'customer_code.required' => 'សូមបញ្ចូល Customer Code',
            'customer_code.unique' => 'កូដអតិថិជននេះត្រូវបានប្រើប្រាស់រួចហើយ។ សូមប្រើកូដផ្សេងទៀត។',
            'customer_code.max' => 'Customer Code មិនអាចលើសពី 50 តួអក្សរ។',

            'customer_name.required' => 'សូមបញ្ចូលឈ្មោះអតិថិជន',
            'customer_name.max' => 'ឈ្មោះអតិថិជនមិនអាចលើសពី 150 តួអក្សរ។',

            'customer_type.required' => 'សូមជ្រើសរើសប្រភេទអតិថិជន',
            'customer_type.in' => 'ប្រភេទអតិថិជនត្រូវតែជា Retail ឬ Wholesale',

            'email.required' => 'សូមបញ្ចូល Email',
            'email.email' => 'Email មិនត្រឹមត្រូវ',
            'email.unique' => 'Email នេះមានអ្នកប្រើរួចហើយ',

            'phone.max' => 'លេខទូរស័ព្ទមិនអាចលើសពី 30 តួអក្សរ។',

            'status.required' => 'សូមជ្រើសរើសស្ថានភាព',
            'status.in' => 'ស្ថានភាពត្រូវតែជា Active ឬ Inactive',
        ];
    }
}
