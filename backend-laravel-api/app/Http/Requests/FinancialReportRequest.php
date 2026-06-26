<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FinancialReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'report_type' => 'required|string|in:balance_sheet,income_statement,cash_flow,trial_balance',
            'branch_id' => 'nullable|integer',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'generated_by' => 'nullable|integer',
            'description' => 'nullable|string',
            'files' => 'nullable|array',
            'files.*' => 'nullable|file|mimes:pdf,xlsx,xls,docx|max:10240',
            'existing_files' => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'report_type.required' => 'សូមជ្រើសរើសប្រភេទរបាយការណ៍ហិរញ្ញវត្ថុ',
            'start_date.required' => 'សូមជ្រើសរើសថ្ងៃចាប់ផ្តើម',
            'end_date.required' => 'សូមជ្រើសរើសថ្ងៃបញ្ចប់',
            'end_date.after_or_equal' => 'ថ្ងៃបញ្ចប់មិនអាចតូចជាងថ្ងៃចាប់ផ្តើមបានទេ',
            'files.*.mimes' => 'ទម្រង់ឯកសារគាំទ្រតែ PDF, Excel និង Word តែប៉ុណ្ណោះ',

            'files.*.max' => 'ទំហំឯកសារនីមួយៗមិនអាចធំជាង 10MB ឡើយ',
        ];
    }
}
