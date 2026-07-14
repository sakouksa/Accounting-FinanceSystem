<?php

namespace App\Repositories;

use App\Models\Report;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ReportRepository
{
    public function getPaginatedList(array $filters, $limit = 10)
    {
        $query = Report::with([
            'branch:id,name,code',
            'generator:id,full_name,username',
        ]);

        if (! empty($filters['txt_search'])) {
            $search = $filters['txt_search'];
            $query->where(function ($q) use ($search) {
                $q->where('report_name', 'LIKE', "%{$search}%")
                    ->orWhere('notes', 'LIKE', "%{$search}%");
            });
        }

        if (! empty($filters['report_type'])) {
            $query->where('report_type', $filters['report_type']);
        }

        if (! empty($filters['branch_id'])) {
            $query->where('branch_id', $filters['branch_id']);
        }

        if (! empty($filters['from_date']) && ! empty($filters['to_date'])) {
            $query->where(function ($q) use ($filters) {
                $q->whereDate('start_date', '>=', $filters['from_date'])
                    ->whereDate('end_date', '<=', $filters['to_date']);
            });
        }

        return $query
            ->orderBy('id', 'desc')
            ->paginate($limit);
    }

    public function getStats()
    {
        return [
            'total_reports' => Report::count(),
            'balance_sheet_count' => Report::where('report_type', 'balance_sheet')->count(),
            'income_statement_count' => Report::where('report_type', 'income_statement')->count(),
            'cash_flow_count' => Report::where('report_type', 'cash_flow')->count(),
        ];
    }

    public function findById($id)
    {
        return Report::with([
            'branch:id,name,code',
            'generator:id,full_name,username',
        ])->findOrFail($id);
    }

    // CREATE
    public function createReport(array $data)
    {
        return DB::transaction(function () use ($data) {
            if (! isset($data['report_date'])) {
                $data['report_date'] = now();
            }

            if (isset($data['file_path'])) {
                $data['file_path'] = $this->formatFilePath($data['file_path']);
            }

            return Report::create($data);
        });
    }

    // UPDATE
    public function updateReport(array $data, $id)
    {
        return DB::transaction(function () use ($data, $id) {
            $report = Report::findOrFail($id);

            if (isset($data['file_path'])) {
                $data['file_path'] = $this->formatFilePath($data['file_path']);
            }

            $report->update($data);

            return $report;
        });
    }

    // DELETE SINGLE
    public function deleteReport($id)
    {
        return DB::transaction(function () use ($id) {
            $report = Report::findOrFail($id);

            if ($report->file_path && Storage::disk('public')->exists($report->file_path)) {
                Storage::disk('public')->delete($report->file_path);
            }

            $report->delete();

            return $report;
        });
    }

    // BULK DELETE
    public function bulkDelete(array $ids)
    {
        $reports = Report::whereIn('id', $ids)->get();

        foreach ($reports as $item) {
            if ($item->file_path && Storage::disk('public')->exists($item->file_path)) {
                Storage::disk('public')->delete($item->file_path);
            }
            $item->delete();
        }

        return true;
    }

    public function deleteAll()
    {
        $reports = Report::all();
        foreach ($reports as $item) {
            if ($item->file_path && Storage::disk('public')->exists($item->file_path)) {
                Storage::disk('public')->delete($item->file_path);
            }
            $item->delete();
        }
        return true;
    }

    /**
     * Helper clean path URL
     */
    private function formatFilePath($filePath)
    {
        if (empty($filePath)) {
            return null;
        }

        if (is_string($filePath) && str_starts_with($filePath, '[')) {
            $arr = json_decode($filePath, true);
            $filePath = is_array($arr) ? ($arr[0] ?? null) : $filePath;
        } elseif (is_array($filePath)) {
            $filePath = $filePath[0] ?? null;
        }

        $cleanPath = preg_replace('/^http:\/\/localhost:\d+\/storage\//', '', $filePath);
        $cleanPath = preg_replace('/^http:\/\/127\.0\.0\.1:\d+\/storage\//', '', $cleanPath);

        return ltrim(trim($cleanPath), '/');
    }
}
