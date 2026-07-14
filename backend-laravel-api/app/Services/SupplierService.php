<?php

namespace App\Services;

use App\Repositories\SupplierRepository;

class SupplierService
{
    protected $supplierRepository;

    public function __construct(SupplierRepository $supplierRepository)
    {
        $this->supplierRepository = $supplierRepository;
    }

    public function getAll($request)
    {
        return $this->supplierRepository->getAll($request);
    }

    public function getStats()
    {
        return $this->supplierRepository->getStats();
    }

    public function findById($id)
    {
        return $this->supplierRepository->findById($id);
    }

    public function createSupplier(array $data)
    {
        return $this->supplierRepository->createSupplier($data);
    }

    public function updateSupplier(array $data, $id)
    {
        return $this->supplierRepository->updateSupplier($data, $id);
    }

    public function deleteSupplier($id)
    {
        return $this->supplierRepository->deleteSupplier($id);
    }

    public function changeStatus($id, $status)
    {
        return $this->supplierRepository->changeStatus($id, $status);
    }

    public function bulkDelete(array $ids)
    {
        return $this->supplierRepository->bulkDelete($ids);
    }

    public function deleteAll()
    {
        return $this->supplierRepository->deleteAll();
    }
}
