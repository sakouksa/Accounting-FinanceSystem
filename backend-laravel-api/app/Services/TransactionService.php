<?php

namespace App\Services;

use App\Repositories\TransactionRepository;

class TransactionService
{
    protected $transactionRepository;

    public function __construct(TransactionRepository $transactionRepository)
    {
        $this->transactionRepository = $transactionRepository;
    }

    public function getAll($request)
    {
        return $this->transactionRepository->getAll($request);
    }

    public function getStats()
    {
        return $this->transactionRepository->getStats();
    }

    public function getBranchesLookup()
    {
        return $this->transactionRepository->getBranchesLookup();
    }

    public function getTransactionTypesLookup()
    {
        return $this->transactionRepository->getTransactionTypesLookup();
    }

    public function findById($id)
    {
        return $this->transactionRepository->findById($id);
    }

    public function createTransaction(array $data)
    {
        return $this->transactionRepository->createTransaction($data);
    }

    public function updateTransaction(array $data, $id)
    {
        return $this->transactionRepository->updateTransaction($data, $id);
    }

    public function deleteTransaction($id)
    {
        return $this->transactionRepository->deleteTransaction($id);
    }

    public function bulkDelete(array $ids)
    {
        return $this->transactionRepository->bulkDelete($ids);
    }

    public function deleteAll()
    {
        return $this->transactionRepository->deleteAll();
    }
}
