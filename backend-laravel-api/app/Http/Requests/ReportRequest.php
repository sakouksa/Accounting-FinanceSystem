<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');

        return [
            // varchar(150) in Database
            'report_name' => ['required', 'string', 'max:150'],

            // varchar(100) in Database
            'report_type' => ['required', 'string', 'max:100'],

            // date (No Null) in Database ត្រូវតែបំពេញដាច់ខាត
            'report_date' => ['required', 'date'],

            // date (Null) in Database
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],

            // bigint(20) UNSIGNED (Null) ក្នុង Database
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'generated_by' => ['nullable', 'integer', 'exists:users,id'],

            // ផ្អែកលើ enum('pdf', 'excel', 'html', 'csv') នៅក្នុង Database របស់បង
            'file_format' => [
                'nullable',
                'string',
                Rule::in(['pdf', 'excel', 'html', 'csv']),
            ],

            // ផ្អែកលើ enum('draft', 'generated', 'failed') នៅក្នុង Database របស់បង
            'status' => [
                'nullable',
                'string',
                Rule::in(['draft', 'generated', 'failed']),
            ],

            // longtext (Null) ក្នុង Database សម្រាប់ផ្ទុក JSON ទិន្នន័យតម្រង
            'filters' => ['nullable', 'array'],

            // text (Null) in Database
            'notes' => ['nullable', 'string'],

            // សម្រាប់គ្រប់គ្រងទិន្នន័យឯកសារផ្ញើមកពី Frontend (Ant Design Upload)
            'files' => [$isUpdate ? 'nullable' : 'required', 'array', 'max:1'],
            'files.*' => ['file', 'mimes:pdf,xlsx,xls,docx,doc', 'max:10240'],
            'existing_files' => ['nullable', 'array'],
        ];
    }

    /**
     * Get custom error messages for validator failures.
     */
    public function messages(): array
    {
        return [
            'report_name.required' => 'សូមបញ្ចូលឈ្មោះរបាយការណ៍។',
            'report_name.max' => 'ឈ្មោះរបាយការណ៍មិនអាចលើសពី ១៥០ តួអក្សរឡើយ។',
            'report_type.required' => 'សូមជ្រើសរើសប្រភេទរបាយការណ៍។',
            'report_date.required' => 'សូមជ្រើសរើសកាលបរិច្ឆេទរបាយការណ៍។',
            'end_date.after_or_equal' => 'ថ្ងៃខែបញ្ចប់ត្រូវតែនៅក្រោយ ឬស្មើនឹងថ្ងៃខែចាប់ផ្ដើម។',
            'branch_id.exists' => 'សាខាដែលបានជ្រើសរើសមិនត្រឹមត្រូវឡើយ។',
            'file_format.in' => 'ប្រភេទឯកសារត្រូវតែជា៖ pdf, excel, html ឬ csv តែប៉ុណ្ណោះ។',
            'status.in' => 'ស្ថានភាពរបាយការណ៍ត្រូវតែជា៖ draft, generated ឬ failed តែប៉ុណ្ណោះ។',
            'files.required' => 'សូមភ្ជាប់ឯកសាររបាយការណ៍មកជាមួយ។',
            'files.*.max' => 'ទំហំឯកសារមិនអាចធំជាង 10MB បានឡើយ។',
        ];
    }
}
