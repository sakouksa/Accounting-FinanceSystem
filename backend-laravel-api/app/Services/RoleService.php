<?php

namespace App\Services;

use App\Repositories\RoleRepository;

class RoleService
{
    protected $roleRepository;

    public function __construct(RoleRepository $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    public function getAll($request)
    {
        return $this->roleRepository->getAll($request);
    }

    public function getStats()
    {
        return $this->roleRepository->getStats();
    }

    public function getAllPermissionsList()
    {
        return $this->roleRepository->getAllPermissionsList();
    }

    public function findById($id)
    {
        return $this->roleRepository->findById($id);
    }

    public function createRole(array $data)
    {
        return $this->roleRepository->createRole($data);
    }

    public function updateRole(array $data, $id)
    {
        return $this->roleRepository->updateRole($data, $id);
    }

    public function deleteRole($id)
    {
        return $this->roleRepository->deleteRole($id);
    }

    public function changeStatus($id, $status)
    {
        return $this->roleRepository->changeStatus($id, $status);
    }
}
