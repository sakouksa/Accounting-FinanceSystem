<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BudgetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation Rules
     */
    public function rules(): array
    {
        return [
            'budget_name' => 'required|string|max:255',

            'fiscal_year' => 'required|string|max:20',

            'account_id' => 'required|exists:chart_of_accounts,id',

            'branch_id' => 'nullable|exists:branches,id',

            'allocated_amount' => 'required|numeric|min:0',

            'used_amount' => 'nullable|numeric|min:0',

            'start_date' => 'required|date',

            'end_date' => 'required|date|after_or_equal:start_date',

            'status' => 'required|in:active,closed',
        ];
    }

    /**
     * Custom Messages
     */
    public function messages(): array
    {
        return [
            'budget_name.required' => 'សូមបញ្ចូលឈ្មោះថវិកា។',

            'fiscal_year.required' => 'សូមបញ្ចូលឆ្នាំហិរញ្ញវត្ថុ។',

            'account_id.required' => 'សូមជ្រើសរើសគណនី។',
            'account_id.exists' => 'គណនីដែលបានជ្រើសរើសមិនត្រឹមត្រូវ។',

            'branch_id.exists' => 'សាខាដែលបានជ្រើសរើសមិនត្រឹមត្រូវ។',

            'allocated_amount.required' => 'សូមបញ្ចូលចំនួនថវិកា។',
            'allocated_amount.numeric' => 'ចំនួនថវិកាត្រូវតែជាលេខ។',
            'allocated_amount.min' => 'ចំនួនថវិកាត្រូវតែធំជាង ឬស្មើ 0។',

            'used_amount.numeric' => 'ចំនួនដែលបានប្រើត្រូវតែជាលេខ។',
            'used_amount.min' => 'ចំនួនដែលបានប្រើត្រូវតែធំជាង ឬស្មើ 0។',

            'start_date.required' => 'សូមជ្រើសរើសថ្ងៃចាប់ផ្តើម។',
            'start_date.date' => 'ថ្ងៃចាប់ផ្តើមមិនត្រឹមត្រូវ។',

            'end_date.required' => 'សូមជ្រើសរើសថ្ងៃបញ្ចប់។',
            'end_date.date' => 'ថ្ងៃបញ្ចប់មិនត្រឹមត្រូវ។',
            'end_date.after_or_equal' => 'ថ្ងៃបញ្ចប់ត្រូវតែធំជាង ឬស្មើថ្ងៃចាប់ផ្តើម។',

            'status.required' => 'សូមជ្រើសរើសស្ថានភាព។',
            'status.in' => 'ស្ថានភាពមិនត្រឹមត្រូវ។',
        ];
    }
}
