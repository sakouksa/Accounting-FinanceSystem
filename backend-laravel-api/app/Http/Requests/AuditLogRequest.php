```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AuditLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'user_id' => ['nullable', 'exists:users,id'],

            'action_type' => ['required', 'string', 'max:100'],

            'module' => ['required', 'string', 'max:100'],

            'table_name' => ['required', 'string', 'max:100'],

            'record_id' => ['nullable', 'integer'],

            'ip_address' => ['nullable', 'string', 'max:100'],

            'device_info' => ['nullable', 'string'],

            'old_value' => ['nullable', 'array'],

            'new_value' => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [

            'action_type.required' => 'សូមបញ្ចូល action type',

            'module.required' => 'សូមបញ្ចូល module',

            'table_name.required' => 'សូមបញ្ចូល table name',
        ];
    }
}
```