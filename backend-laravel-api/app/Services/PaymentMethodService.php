<?php

namespace App\Services;

use App\Repositories\PaymentMethodRepository;

class PaymentMethodService
{
    protected $paymentMethodRepository;

    public function __construct(PaymentMethodRepository $paymentMethodRepository)
    {
        $this->paymentMethodRepository = $paymentMethodRepository;
    }

    public function getAll($request)
    {
        return $this->paymentMethodRepository->getAll($request);
    }

    public function getStats()
    {
        return $this->paymentMethodRepository->getStats();
    }

    public function findById($id)
    {
        return $this->paymentMethodRepository->findById($id);
    }

    public function createPaymentMethod(array $data)
    {
        return $this->paymentMethodRepository->createPaymentMethod($data);
    }

    public function updatePaymentMethod(array $data, $id)
    {
        return $this->paymentMethodRepository->updatePaymentMethod($data, $id);
    }

    public function deletePaymentMethod($id)
    {
        return $this->paymentMethodRepository->deletePaymentMethod($id);
    }

    public function changeStatus($id, $status)
    {
        return $this->paymentMethodRepository->changeStatus($id, $status);
    }

    public function bulkDelete(array $ids)
    {
        return $this->paymentMethodRepository->bulkDelete($ids);
    }

    public function deleteAll()
    {
        return $this->paymentMethodRepository->deleteAll();
    }
}
