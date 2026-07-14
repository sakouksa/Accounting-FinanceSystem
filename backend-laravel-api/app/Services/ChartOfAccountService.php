<?php

namespace App\Services;

use App\Repositories\ChartOfAccountRepository;

class ChartOfAccountService
{
    protected $coaRepository;

    public function __construct(ChartOfAccountRepository $coaRepository)
    {
        $this->coaRepository = $coaRepository;
    }

    public function getAll($request)
    {
        return $this->coaRepository->getAll($request);
    }

    public function getStats()
    {
        return $this->coaRepository->getStats();
    }

    public function getAccountTypesLookup()
    {
        return $this->coaRepository->getAccountTypesLookup();
    }

    public function getParentAccountsLookup()
    {
        return $this->coaRepository->getParentAccountsLookup();
    }

    public function findById($id)
    {
        return $this->coaRepository->findById($id);
    }

    public function createChartOfAccount(array $data)
    {
        return $this->coaRepository->createChartOfAccount($data);
    }

    public function updateChartOfAccount(array $data, $id)
    {
        return $this->coaRepository->updateChartOfAccount($data, $id);
    }

    public function deleteChartOfAccount($id)
    {
        return $this->coaRepository->deleteChartOfAccount($id);
    }

    public function changeStatus($id, $status)
    {
        return $this->coaRepository->changeStatus($id, $status);
    }

    public function bulkDelete(array $ids)
    {
        return $this->coaRepository->bulkDelete($ids);
    }

    public function deleteAll()
    {
        return $this->coaRepository->deleteAll();
    }
}
