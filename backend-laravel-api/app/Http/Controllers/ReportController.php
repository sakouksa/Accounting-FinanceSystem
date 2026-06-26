<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReportRequest;
use App\Models\Branch;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
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

        return response()->json([
            'list' => $items,
            'total' => $paginator->total(),
            'branches' => Branch::select('id', 'name', 'code')->where('status', 'active')->get(),
        ]);
    }

    // GET STATS
    public function getStats()
    {
        try {
            $stats = $this->reportService->getStats();

            return response()->json([
                'stats' => $stats,
                'message' => 'ទាញទិន្នន័យស្ថិតិជោគជ័យ',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'មិនអាចទាញទិន្នន័យស្ថិតិបានទេ: '.$e->getMessage(),
            ], 500);
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

        return response()->json([
            'data' => $report,
            'message' => 'បានបង្កើតទិន្នន័យរបាយការណ៍ដោយជោគជ័យ',
        ]);
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

        return response()->json([
            'data' => $report,
            'message' => 'បានកែប្រែទិន្នន័យរបាយការណ៍ដោយជោគជ័យ',
        ]);
    }

    // SHOW
    public function show($id)
    {
        $report = $this->reportService->findById($id);

        if ($report->file_path) {
            $report->file_path = asset('storage/'.$report->file_path);
        }

        return response()->json([
            'data' => $report,
        ]);
    }

    // DELETE
    public function destroy($id)
    {
        try {
            $report = $this->reportService->deleteReport($id);

            return response()->json([
                'data' => $report,
                'message' => 'បានលុបទិន្នន័យរបាយការណ៍ដោយជោគជ័យ',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        $this->reportService->bulkDelete($request->get('ids', []));

        return response()->json([
            'message' => 'លុបទិន្នន័យរបាយការណ៍ដែលជ្រើសរើសជោគជ័យ',
        ]);
    }
}
