<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReportRequest;
use App\Models\Branch;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ReportController extends Controller implements HasMiddleware
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:reports.read', only: ['index', 'show', 'getStats']),
            new Middleware('permission:reports.create', only: ['store']),
            new Middleware('permission:reports.update', only: ['update']),
            new Middleware('permission:reports.delete', only: ['destroy', 'bulkDelete', 'deleteAll']),
        ];
    }

    // LIST
    public function index(Request $request)
    {
        $limit = $request->get('limit', 10);
        $paginator = $this->reportService->getPaginatedList($request->all(), $limit);

        $items = collect($paginator->items())->map(function ($report) {
            if ($report->file_path) {
                $report->file_path = asset('storage/'.$report->file_path);
            }

            return $report;
        });

        return $this->paginatedResponse(
            $items,
            $paginator->total(),
            200,
            'Success',
            [
                'branches' => Branch::select('id', 'name', 'code')->where('status', 'active')->get()
            ]
        );
    }

    // GET STATS
    public function getStats()
    {
        try {
            $stats = $this->reportService->getStats();

            return $this->successResponse($stats, 'ទាញទិន្នន័យស្ថិតិជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse('មិនអាចទាញទិន្នន័យស្ថិតិបានទេ: '.$e->getMessage(), 500);
        }
    }

    // STORE
    public function store(ReportRequest $request)
    {
        $data = $request->validated();

        if (! isset($data['generated_by'])) {
            $data['generated_by'] = auth()->id() ?? $request->get('user_id');
        }
        if ($request->hasFile('files')) {
            $file = $request->file('files')[0];
            $filename = time().'_'.$file->getClientOriginalName();

            // save in storage/app/public/financial-reports
            $path = $file->storeAs('financial-reports', $filename, 'public');

            $data['file_path'] = $path;
            $data['file_format'] = $file->getClientOriginalExtension();
        } else {
            $data['file_path'] = null;
            $data['file_format'] = $data['file_format'] ?? null;
        }

        $report = $this->reportService->createReport($data);

        return $this->successResponse($report, 'បានបង្កើតទិន្នន័យរបាយការណ៍ដោយជោគជ័យ', 201);
    }

    // UPDATE
    public function update(ReportRequest $request, $id)
    {
        $data = $request->validated();
        $reportInstance = $this->reportService->findById($id);

        if ($request->hasFile('files')) {
            if ($reportInstance->file_path && Storage::disk('public')->exists($reportInstance->file_path)) {
                Storage::disk('public')->delete($reportInstance->file_path);
            }

            $file = $request->file('files')[0];
            $filename = time().'_'.$file->getClientOriginalName();
            $path = $file->storeAs('financial-reports', $filename, 'public');

            $data['file_path'] = $path;
            $data['file_format'] = $file->getClientOriginalExtension();
        } else {
            if ($request->has('existing_files') && count($request->input('existing_files')) > 0) {
                $data['file_path'] = $reportInstance->file_path;
                $data['file_format'] = $reportInstance->file_format;
            } else {
                if ($reportInstance->file_path && Storage::disk('public')->exists($reportInstance->file_path)) {
                    Storage::disk('public')->delete($reportInstance->file_path);
                }
                $data['file_path'] = null;
                $data['file_format'] = null;
            }
        }

        $report = $this->reportService->updateReport($data, $id);

        return $this->successResponse($report, 'បានកែប្រែទិន្នន័យរបាយការណ៍ដោយជោគជ័យ');
    }

    // SHOW
    public function show($id)
    {
        $report = $this->reportService->findById($id);

        if ($report->file_path) {
            $report->file_path = asset('storage/'.$report->file_path);
        }

        return $this->successResponse($report);
    }

    // DELETE
    public function destroy($id)
    {
        try {
            $report = $this->reportService->deleteReport($id);

            return $this->successResponse($report, 'បានលុបទិន្នន័យរបាយការណ៍ដោយជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:reports,id',
        ]);

        $this->reportService->bulkDelete($request->get('ids', []));

        return $this->successResponse(null, 'លុបទិន្នន័យរបាយការណ៍ដែលជ្រើសរើសជោគជ័យ');
    }

    // DELETE ALL
    public function deleteAll()
    {
        $this->reportService->deleteAll();

        return $this->successResponse(null, 'លុបទាំងអស់ជោគជ័យ');
    }
}
