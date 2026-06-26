<?php

namespace App\Services;

use App\Repositories\CashFlowRepository;

class CashFlowService
{
    protected $cashFlowRepository;

    public function __construct(CashFlowRepository $cashFlowRepository)
    {
        $this->cashFlowRepository = $cashFlowRepository;
    }

    public function getPaginatedList(array $filters, $limit = 10)
    {
        return $this->cashFlowRepository->getPaginatedList(
            $filters,
            $limit
        );
    }

    public function getStats()
    {
        return $this->cashFlowRepository->getStats();
    }

    public function findById($id)
    {
        return $this->cashFlowRepository->findById($id);
    }

    public function createCashFlow(array $data)
    {
        return $this->cashFlowRepository->createCashFlow($data);
    }

    public function updateCashFlow(array $data, $id)
    {
        return $this->cashFlowRepository->updateCashFlow(
            $data,
            $id
        );
    }

    public function deleteCashFlow($id)
    {
        return $this->cashFlowRepository->deleteCashFlow($id);
    }

    public function bulkDelete(array $ids)
    {
        return $this->cashFlowRepository->bulkDelete($ids);
    }

    public function deleteAll()
    {
        return $this->cashFlowRepository->deleteAll();
    }
}
