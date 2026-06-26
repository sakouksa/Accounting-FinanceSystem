<?php

namespace App\Services;

use App\Repositories\ReportRepository;

class ReportService
{
    protected $reportRepository;

    public function __construct(ReportRepository $reportRepository)
    {
        $this->reportRepository = $reportRepository;
    }

    public function getPaginatedList(array $filters, $limit = 10)
    {
        return $this->reportRepository->getPaginatedList($filters, $limit);
    }

    public function getStats()
    {
        return $this->reportRepository->getStats();
    }

    public function findById($id)
    {
        return $this->reportRepository->findById($id);
    }

    public function createReport(array $data)
    {
        return $this->reportRepository->createReport($data);
    }

    public function updateReport(array $data, $id)
    {
        return $this->reportRepository->updateReport($data, $id);
    }

    public function deleteReport($id)
    {
        return $this->reportRepository->deleteReport($id);
    }

    public function bulkDelete(array $ids)
    {
        return $this->reportRepository->bulkDelete($ids);
    }
}
