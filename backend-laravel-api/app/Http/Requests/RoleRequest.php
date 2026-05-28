<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $roleId = $this->route('role');

        if ($roleId instanceof \App\Models\Role) {
            $roleId = $roleId->id;
        }

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],

            'code' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                Rule::unique('roles', 'code')->ignore($roleId),
            ],

            'description' => ['nullable', 'string'],

            'status' => ['sometimes', 'required', 'in:active,inactive'],
        ];
    }
}