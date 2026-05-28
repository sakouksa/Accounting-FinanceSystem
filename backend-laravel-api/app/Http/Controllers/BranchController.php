<?php

namespace App\Http\Controllers;

use App\Http\Requests\BranchRequest;
use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    // LIST
    public function index(Request $req)
    {
        $query = Branch::query();

        if ($req->has("txt_search")) {
            $query->where("name", "LIKE", "%" . $req->input("txt_search") . "%")
                ->orWhere("code", "LIKE", "%" . $req->input("txt_search") . "%");
        }

        if ($req->has("status")) {
            $query->where("status", $req->input("status"));
        }

        $list = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'list' => $list,
            'total' => $list->count(),
        ]);
    }

    // STATS
    public function stats()
    {
        $stats = [
            [
                "title" => "សាខាសរុប",
                "value" => Branch::count(),
                "color" => "#6366f1",
                "icon" => "ApartmentOutlined"
            ],
            [
                "title" => "សាខាសកម្ម",
                "value" => Branch::where('status', 'active')->count(),
                "color" => "#10b981",
                "icon" => "CheckCircleOutlined"
            ],
            [
                "title" => "សាខាអសកម្ម",
                "value" => Branch::where('status', 'inactive')->count(),
                "color" => "#ef4444",
                "icon" => "CloseCircleOutlined"
            ],
            [
                "title" => "បង្កើតថ្ងៃនេះ",
                "value" => Branch::whereDate('created_at', today())->count(),
                "color" => "#f59e0b",
                "icon" => "CalendarOutlined"
            ]
        ];

        return response()->json([
            'stats' => $stats
        ]);
    }

    // STORE
    public function store(BranchRequest $request)
    {
        $branch = Branch::create($request->validated());

        return response()->json([
            'data' => $branch,
            'message' => 'បានបង្កើតសាខាថ្មីដោយជោគជ័យ',
        ]);
    }

    // SHOW
    public function show(string $id)
    {
        return Branch::find($id);
    }

    // UPDATE
    public function update(BranchRequest $request, string $id)
    {
        $branch = Branch::findOrFail($id);
        $branch->update($request->validated());

        return response()->json([
            'data' => $branch,
            'message' => 'បានកែប្រែសាខាដោយជោគជ័យ',
        ]);
    }

    // DELETE
    public function destroy(string $id)
    {
        $branch = Branch::find($id);

        if (!$branch) {
            return [
                'error' => true,
                'message' => 'រកមិនឃើញសាខា',
            ];
        }

        $branch->delete();

        return [
            'data' => $branch,
            'message' => 'បានលុបសាខាដោយជោគជ័យ',
        ];
    }

    // CHANGE STATUS
    public function changeStatus(Request $request, $id)
    {
        $branch = Branch::find($id);

        if (!$branch) {
            return [
                'error' => true,
                'message' => 'រកមិនឃើញសាខា',
            ];
        }

        $branch->status = $request->input('status');
        $branch->save();

        return [
            'data' => $branch,
            'message' => 'បានប្តូរស្ថានភាពដោយជោគជ័យ',
        ];
    }
    public function bulkDelete(Request $request)
    {
        $ids = $request->ids;

        Branch::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'លុបជោគជ័យ',
        ]);
    }
    public function deleteAll()
    {
        Branch::truncate();

        return response()->json([
            'message' => 'លុបទាំងអស់ជោគជ័យ'
        ]);
    }
}