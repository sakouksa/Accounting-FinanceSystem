<?php

namespace App\Services;

use App\Repositories\TransactionDetailRepository;

class TransactionDetailService
{
    protected $detailRepository;

    public function __construct(TransactionDetailRepository $detailRepository)
    {
        $this->detailRepository = $detailRepository;
    }

    public function getAll($request)
    {
        return $this->detailRepository->getAll($request);
    }

    public function getStats()
    {
        return $this->detailRepository->getStats();
    }

    public function getTransactionsLookup()
    {
        return $this->detailRepository->getTransactionsLookup();
    }

    public function getAccountsLookup()
    {
        return $this->detailRepository->getAccountsLookup();
    }

    public function findById($id)
    {
        return $this->detailRepository->findById($id);
    }

    public function createTransactionDetail(array $data)
    {
        return $this->detailRepository->createTransactionDetail($data);
    }

    public function updateTransactionDetail(array $data, $id)
    {
        return $this->detailRepository->updateTransactionDetail($data, $id);
    }

    public function deleteTransactionDetail($id)
    {
        return $this->detailRepository->deleteTransactionDetail($id);
    }

    public function bulkDelete(array $ids)
    {
        return $this->detailRepository->bulkDelete($ids);
    }

    public function deleteAll()
    {
        return $this->detailRepository->deleteAll();
    }
}
