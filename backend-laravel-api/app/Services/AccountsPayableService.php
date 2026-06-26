<?php

namespace App\Services;

use App\Repositories\AccountsPayableRepository;

class AccountsPayableService
{
    protected $accountsPayableRepository;

    public function __construct(
        AccountsPayableRepository $accountsPayableRepository
    ) {
        $this->accountsPayableRepository = $accountsPayableRepository;
    }

    public function getAll($request)
    {
        return $this->accountsPayableRepository->getAll($request);
    }

    public function getStats()
    {
        return $this->accountsPayableRepository->getStats();
    }

    public function findById($id)
    {
        return $this->accountsPayableRepository->findById($id);
    }

    public function createAccountsPayable(array $data)
    {
        return $this->accountsPayableRepository->createAccountsPayable($data);
    }

    public function updateAccountsPayable(array $data, $id)
    {
        return $this->accountsPayableRepository
            ->updateAccountsPayable($data, $id);
    }

    public function deleteAccountsPayable($id)
    {
        return $this->accountsPayableRepository
            ->deleteAccountsPayable($id);
    }

    public function changeStatus($id, $status)
    {
        return $this->accountsPayableRepository
            ->changeStatus($id, $status);
    }

    public function bulkDelete(array $ids)
    {
        return $this->accountsPayableRepository->bulkDelete($ids);
    }

    public function deleteAll()
    {
        return $this->accountsPayableRepository->deleteAll();
    }
}
