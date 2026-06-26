<?php

namespace App\Repositories;

use App\Models\User;

class ProfileRepository
{
    public function getProfile()
    {
        $user = User::with(['role.permissions', 'branch'])
            ->findOrFail(auth()->id());

        return [
            'id' => $user->id,
            'full_name' => $user->full_name,
            'email' => $user->email,
            'phone' => $user->phone,
            'status' => $user->status,
            'profile_image' => $user->profile_image,

            'role' => [
                'id' => $user->role?->id,
                'role_name' => $user->role?->name,
            ],

            'branch' => [
                'id' => $user->branch?->id,
                'branch_name' => $user->branch?->name,
            ],
        ];
    }

    // (optional future use)
    public function updateProfile($id, array $data)
    {
        $user = User::findOrFail($id);
        $user->update($data);

        return $this->getProfile();
    }
}
