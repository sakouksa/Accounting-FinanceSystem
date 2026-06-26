<?php

namespace App\Services;

use App\Repositories\AccountsReceivableRepository;

class AccountsReceivableService
{
    protected $arRepository;

    public function __construct(AccountsReceivableRepository $arRepository)
    {
        $this->arRepository = $arRepository;
    }

    public function getAll($request)
    {
        return $this->arRepository->getAll($request);
    }

    public function getStats()
    {
        return $this->arRepository->getStats();
    }

    public function findById($id)
    {
        return $this->arRepository->findById($id);
    }

    public function createAR(array $data)
    {
        $data['paid_amount'] = $data['paid_amount'] ?? 0;
        $data['balance_amount'] = $data['total_amount'] - $data['paid_amount'];

        return $this->arRepository->createAR($data);
    }

    public function updateAR(array $data, $id)
    {
        $data['paid_amount'] = $data['paid_amount'] ?? 0;
        $data['balance_amount'] = $data['total_amount'] - $data['paid_amount'];

        return $this->arRepository->updateAR($data, $id);
    }

    public function deleteAR($id)
    {
        return $this->arRepository->deleteAR($id);
    }

    public function changeStatus($id, $status)
    {
        return $this->arRepository->changeStatus($id, $status);
    }

    public function bulkDelete(array $ids)
    {
        return $this->arRepository->bulkDelete($ids);
    }

    public function deleteAll()
    {
        return $this->arRepository->deleteAll();
    }
}
