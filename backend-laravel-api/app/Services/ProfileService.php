<?php

namespace App\Services;

use App\Repositories\ProfileRepository;

class ProfileService
{
    public function __construct(
        protected ProfileRepository $profileRepository
    ) {}

    public function getProfile()
    {
        return $this->profileRepository->getProfile();
    }

    public function updateProfile($id, array $data)
    {
        return $this->profileRepository->updateProfile($id, $data);
    }
}
