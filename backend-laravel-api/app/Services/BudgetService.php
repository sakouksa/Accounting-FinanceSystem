<?php

namespace App\Services;

use App\Repositories\BudgetRepository;

class BudgetService
{
    protected $budgetRepository;

    public function __construct(BudgetRepository $budgetRepository)
    {
        $this->budgetRepository = $budgetRepository;
    }

    public function getPaginatedList(array $filters, $limit = 10)
    {
        return $this->budgetRepository->getPaginatedList($filters, $limit);
    }

    public function getStats()
    {
        return $this->budgetRepository->getStats();
    }

    public function findById($id)
    {
        return $this->budgetRepository->findById($id);
    }

    public function createBudget(array $data)
    {
        $data['used_amount'] = $data['used_amount'] ?? 0;

        $data['remaining_amount'] =
            $data['allocated_amount'] - $data['used_amount'];

        $data['created_by'] = auth()->id();

        return $this->budgetRepository->createBudget($data);
    }

    public function updateBudget(array $data, $id)
    {
        $data['used_amount'] = $data['used_amount'] ?? 0;

        $data['remaining_amount'] =
            $data['allocated_amount'] - $data['used_amount'];

        return $this->budgetRepository->updateBudget($data, $id);
    }

    public function deleteBudget($id)
    {
        return $this->budgetRepository->deleteBudget($id);
    }

    public function changeStatus($id, $status)
    {
        return $this->budgetRepository->changeStatus($id, $status);
    }

    public function bulkDelete(array $ids)
    {
        return $this->budgetRepository->bulkDelete($ids);
    }

    public function deleteAll()
    {
        return $this->budgetRepository->deleteAll();
    }
}
