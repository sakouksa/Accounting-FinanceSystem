<?php

namespace App\Services;

use App\Repositories\CustomerRepository;

class CustomerService
{
    protected $customerRepository;

    public function __construct(CustomerRepository $customerRepository)
    {
        $this->customerRepository = $customerRepository;
    }

    public function getAll($request)
    {
        return $this->customerRepository->getAll($request);
    }

    public function getStats()
    {
        return $this->customerRepository->getStats();
    }

    public function findById($id)
    {
        return $this->customerRepository->findById($id);
    }

    public function createCustomer(array $data)
    {
        return $this->customerRepository->createCustomer($data);
    }

    public function updateCustomer(array $data, $id)
    {
        return $this->customerRepository->updateCustomer($data, $id);
    }

    public function deleteCustomer($id)
    {
        return $this->customerRepository->deleteCustomer($id);
    }

    public function changeStatus($id, $status)
    {
        return $this->customerRepository->changeStatus($id, $status);
    }

    public function bulkDelete(array $ids)
    {
        return $this->customerRepository->bulkDelete($ids);
    }

    public function deleteAll()
    {
        return $this->customerRepository->deleteAll();
    }
}
