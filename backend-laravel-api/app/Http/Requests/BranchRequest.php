<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $branchId = $this->route('branch');

        if ($branchId instanceof \App\Models\Branch) {
            $branchId = $branchId->id;
        }

        return [
            'name' => ['sometimes', 'required', 'string', 'max:150'],

            'code' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('branches', 'code')->ignore($branchId),
            ],

            'address' => ['nullable', 'string'],

            'phone' => ['nullable', 'string', 'max:30'],

            'status' => ['sometimes', 'required', 'in:active,inactive'],
        ];
    }
}