<?php

namespace App\Services;

use App\Repositories\CurrencyRepository;

class CurrencyService
{
    protected $currencyRepository;

    public function __construct(CurrencyRepository $currencyRepository)
    {
        $this->currencyRepository = $currencyRepository;
    }

    public function getAll($request)
    {
        return $this->currencyRepository->getAll($request);
    }

    public function getStats()
    {
        return $this->currencyRepository->getStats();
    }

    public function findById($id)
    {
        return $this->currencyRepository->findById($id);
    }

    public function createCurrency(array $data)
    {
        return $this->currencyRepository->createCurrency($data);
    }

    public function updateCurrency(array $data, $id)
    {
        return $this->currencyRepository->updateCurrency($data, $id);
    }

    public function deleteCurrency($id)
    {
        return $this->currencyRepository->deleteCurrency($id);
    }

    public function changeStatus($id, $status)
    {
        return $this->currencyRepository->changeStatus($id, $status);
    }

    public function bulkDelete(array $ids)
    {
        return $this->currencyRepository->bulkDelete($ids);
    }

    public function deleteAll()
    {
        return $this->currencyRepository->deleteAll();
    }
}
