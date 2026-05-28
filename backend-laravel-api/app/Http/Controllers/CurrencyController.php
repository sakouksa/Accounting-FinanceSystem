<?php

namespace App\Http\Controllers;

use App\Http\Requests\CurrencyRequest;
use App\Models\Currency;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    // LIST
    public function index(Request $req)
    {
        $query = Currency::query();

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
                "title" => "រូបិយប័ណ្ណសរុប",
                "value" => Currency::count(),
                "color" => "#6366f1",
                "icon" => "DollarOutlined"
            ],
            [
                "title" => "សកម្ម",
                "value" => Currency::where('status', 'active')->count(),
                "color" => "#10b981",
                "icon" => "CheckCircleOutlined"
            ],
            [
                "title" => "អសកម្ម",
                "value" => Currency::where('status', 'inactive')->count(),
                "color" => "#ef4444",
                "icon" => "CloseCircleOutlined"
            ],
            [
                "title" => "បង្កើតថ្ងៃនេះ",
                "value" => Currency::whereDate('created_at', today())->count(),
                "color" => "#f59e0b",
                "icon" => "CalendarOutlined"
            ]
        ];

        return response()->json([
            'stats' => $stats
        ]);
    }

    // STORE
    public function store(CurrencyRequest $request)
    {
        $currency = Currency::create($request->validated());

        return response()->json([
            'data' => $currency,
            'message' => 'បានបង្កើតរូបិយប័ណ្ណដោយជោគជ័យ',
        ]);
    }

    // SHOW
    public function show(string $id)
    {
        return Currency::find($id);
    }

    // UPDATE
    public function update(CurrencyRequest $request, string $id)
    {
        $currency = Currency::findOrFail($id);
        $currency->update($request->validated());

        return response()->json([
            'data' => $currency,
            'message' => 'បានកែប្រែរូបិយប័ណ្ណដោយជោគជ័យ',
        ]);
    }

    // DELETE
    public function destroy(string $id)
    {
        $currency = Currency::find($id);

        if (!$currency) {
            return [
                'error' => true,
                'message' => 'រកមិនឃើញរូបិយប័ណ្ណ',
            ];
        }

        $currency->delete();

        return [
            'data' => $currency,
            'message' => 'បានលុបរូបិយប័ណ្ណដោយជោគជ័យ',
        ];
    }

    // CHANGE STATUS
    public function changeStatus(Request $request, $id)
    {
        $currency = Currency::find($id);

        if (!$currency) {
            return [
                'error' => true,
                'message' => 'រកមិនឃើញរូបិយប័ណ្ណ',
            ];
        }

        $currency->status = $request->input('status');
        $currency->save();

        return [
            'data' => $currency,
            'message' => 'បានប្តូរស្ថានភាពដោយជោគជ័យ',
        ];
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        $ids = $request->ids;

        Currency::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'លុបជោគជ័យ',
        ]);
    }

    // DELETE ALL
    public function deleteAll()
    {
        Currency::query()->delete(); // safer than truncate

        return response()->json([
            'message' => 'លុបទាំងអស់ជោគជ័យ'
        ]);
    }
}