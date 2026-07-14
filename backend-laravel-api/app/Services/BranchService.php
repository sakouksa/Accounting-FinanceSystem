<?php

namespace App\Services;

use App\Repositories\BranchRepository;

class BranchService
{
    protected $branchRepository;

    public function __construct(BranchRepository $branchRepository)
    {
        $this->branchRepository = $branchRepository;
    }

    public function getAll($request)
    {
        return $this->branchRepository->getAll($request);
    }

    public function getStats()
    {
        return $this->branchRepository->getStats();
    }

    public function findById($id)
    {
        return $this->branchRepository->findById($id);
    }

    public function createBranch(array $data)
    {
        return $this->branchRepository->createBranch($data);
    }

    public function updateBranch(array $data, $id)
    {
        return $this->branchRepository->updateBranch($data, $id);
    }

    public function deleteBranch($id)
    {
        return $this->branchRepository->deleteBranch($id);
    }

    public function changeStatus($id, $status)
    {
        return $this->branchRepository->changeStatus($id, $status);
    }

    public function bulkDelete(array $ids)
    {
        return $this->branchRepository->bulkDelete($ids);
    }

    public function deleteAll()
    {
        return $this->branchRepository->deleteAll();
    }
}
