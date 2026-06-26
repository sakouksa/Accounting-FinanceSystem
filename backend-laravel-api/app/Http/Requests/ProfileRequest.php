<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = auth()->id();

        return [
            'full_name' => 'required|string|max:255',

            'gender' => 'nullable|in:male,female',

            'phone' => 'nullable|max:20',

            'email' => "required|email|unique:users,email,$id",

            'username' => "required|unique:users,username,$id",

            'profile_image' => 'nullable|string',
        ];
    }
}
