<?php

namespace App\Services;

use App\Repositories\PaymentRepository;

class PaymentService
{
    protected $paymentRepository;

    public function __construct(PaymentRepository $paymentRepository)
    {
        $this->paymentRepository = $paymentRepository;
    }

    public function getPaginatedList(array $filters, $limit = 10)
    {
        return $this->paymentRepository->getPaginatedList($filters, $limit);
    }

    public function getStats()
    {
        return $this->paymentRepository->getStats();
    }

    public function findById($id)
    {
        return $this->paymentRepository->findById($id);
    }

    public function createPayment(array $data)
    {
        return $this->paymentRepository->createPayment($data);
    }

    public function updatePayment(array $data, $id)
    {
        return $this->paymentRepository->updatePayment($data, $id);
    }

    public function deletePayment($id)
    {
        return $this->paymentRepository->deletePayment($id);
    }

    public function changeStatus($id, $status)
    {
        return $this->paymentRepository->changeStatus($id, $status);
    }

    public function bulkDelete(array $ids)
    {
        return $this->paymentRepository->bulkDelete($ids);
    }

    public function deleteAll()
    {
        return $this->paymentRepository->deleteAll();
    }
}
