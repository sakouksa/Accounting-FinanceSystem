<?php

namespace App\Services;

use App\Repositories\AccountTypeRepository;

class AccountTypeService
{
    protected $accountTypeRepository;

    public function __construct(AccountTypeRepository $accountTypeRepository)
    {
        $this->accountTypeRepository = $accountTypeRepository;
    }

    public function getAll($request)
    {
        return $this->accountTypeRepository->getAll($request);
    }

    public function getStats()
    {
        return $this->accountTypeRepository->getStats();
    }

    public function findById($id)
    {
        return $this->accountTypeRepository->findById($id);
    }

    public function createAccountType(array $data)
    {
        return $this->accountTypeRepository->createAccountType($data);
    }

    public function updateAccountType(array $data, $id)
    {
        return $this->accountTypeRepository->updateAccountType($data, $id);
    }

    public function deleteAccountType($id)
    {
        return $this->accountTypeRepository->deleteAccountType($id);
    }

    public function bulkDelete(array $ids)
    {
        return $this->accountTypeRepository->bulkDelete($ids);
    }

    public function deleteAll()
    {
        return $this->accountTypeRepository->deleteAll();
    }
}
