<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AccountTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('account_types', 'code')->ignore($this->id),
            ],
            'normal_balance' => ['required', 'in:debit,credit'],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'សូមបញ្ចូលឈ្មោះប្រភេទគណនី',
            'name.string' => 'ឈ្មោះប្រភេទគណនីត្រូវតែជាអក្សរ',
            'name.max' => 'ឈ្មោះប្រភេទគណនីមិនអាចលើស 100 តួអក្សរ',
            'code.string' => 'កូដប្រភេទគណនីត្រូវតែជាអក្សរ',
            'code.max' => 'កូដប្រភេទគណនីមិនអាចលើស 50 តួអក្សរ',
            'normal_balance.required' => 'សូមជ្រើសរើសសមតុល្យធម្មតា',
            'normal_balance.in' => 'សមតុល្យធម្មតាត្រូវតែជាមួយ debit ឬ credit',
            'description.string' => 'ការពិពណ៌នាត្រូវតែជាអក្សរ',
            'description.max' => 'ការពិពណ៌នាមិនអាចលើស 255 តួអក្សរ',
        ];
    }
}
