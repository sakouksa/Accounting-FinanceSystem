<?php

namespace App\Services;

use App\Repositories\TransactionTypeRepository;

class TransactionTypeService
{
    protected $typeRepository;

    public function __construct(TransactionTypeRepository $typeRepository)
    {
        $this->typeRepository = $typeRepository;
    }

    public function getAll($request)
    {
        return $this->typeRepository->getAll($request);
    }

    public function getStats()
    {
        return $this->typeRepository->getStats();
    }

    public function findById($id)
    {
        return $this->typeRepository->findById($id);
    }

    public function createTransactionType(array $data)
    {
        return $this->typeRepository->createTransactionType($data);
    }

    public function updateTransactionType(array $data, $id)
    {
        return $this->typeRepository->updateTransactionType($data, $id);
    }

    public function deleteTransactionType($id)
    {
        return $this->typeRepository->deleteTransactionType($id);
    }

    public function changeStatus($id, $isActive)
    {
        return $this->typeRepository->changeStatus($id, $isActive);
    }

    public function bulkDelete(array $ids)
    {
        return $this->typeRepository->bulkDelete($ids);
    }

    public function deleteAll()
    {
        return $this->typeRepository->deleteAll();
    }
}
