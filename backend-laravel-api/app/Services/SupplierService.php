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
}
