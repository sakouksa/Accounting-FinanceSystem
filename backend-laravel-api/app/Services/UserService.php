<?php

namespace App\Services;

use App\Repositories\UserRepository;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function createUser(array $data)
    {
        return $this->userRepository->createUser($data);
    }

    public function updateUser(array $data, $id)
    {
        return $this->userRepository->updateUser($data, $id);
    }

    public function getUsers($request)
    {
        return $this->userRepository->getUsers($request);
    }

    public function deleteUser($id)
    {
        return $this->userRepository->deleteUser($id);
    }

    public function restoreUser($id)
    {
        return $this->userRepository->restoreUser($id);
    }

    public function forceDeleteUser($id)
    {
        return $this->userRepository->forceDeleteUser($id);
    }

    public function changeStatus($id, $status)
    {
        return $this->userRepository->changeStatus($id, $status);
    }

    public function changePassword($id, $password)
    {
        return $this->userRepository->changePassword($id, $password);
    }
}
