<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionTypeRequest;
use App\Models\TransactionType;
use Illuminate\Http\Request;

class TransactionTypeController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = TransactionType::query();
            if ($request->filled('txt_search')) {
                $search = trim($request->txt_search);
                $query->where('code', 'LIKE', "%{$search}%")->orWhere('name', 'LIKE', "%{$search}%");
            }
            if ($request->filled('is_active')) {
                $query->where('is_active', $request->is_active);
            }
            $list = $query->orderBy('id', 'desc')->paginate($request->get('limit', 20));

            return response()->json(['list' => $list->items(), 'total' => $list->total()]);
        } catch (\Exception $e) {
            return response()->json(['errors' => true, 'message' => $e->getMessage()], 500);
        }
    }

    public function stats()
    {
        $stats = [
            [
                'title' => 'សរុប',
                'value' => TransactionType::count(),
                'color' => '#6366f1',
                'icon' => 'DatabaseOutlined',
            ],
            [
                'title' => 'សកម្ម',
                'value' => TransactionType::where('is_active', 1)->count(),
                'color' => '#10b981',
                'icon' => 'CheckCircleOutlined',
            ],
            [
                'title' => 'មិនសកម្ម',
                'value' => TransactionType::where('is_active', 0)->count(),
                'color' => '#ef4444',
                'icon' => 'CloseCircleOutlined',
            ],
            [
                'title' => 'បង្កើតថ្មីថ្ងៃនេះ',
                'value' => TransactionType::whereDate('created_at', today())->count(),
                'color' => '#3b82f6',
                'icon' => 'CalendarOutlined',
            ],
        ];

        return response()->json(['stats' => $stats]);
    }

    public function store(TransactionTypeRequest $request)
    {
        try {
            $data = TransactionType::create($request->validated());

            return response()->json(['data' => $data, 'message' => 'បានបង្កើតជោគជ័យ']);
        } catch (\Exception $e) {
            return response()->json(['errors' => true, 'message' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $data = TransactionType::findOrFail($id);

            return response()->json(['data' => $data]);
        } catch (\Exception $e) {
            return response()->json(['errors' => true, 'message' => 'រកមិនឃើញទិន្នន័យ'], 404);
        }
    }

    public function update(TransactionTypeRequest $request, string $id)
    {
        try {
            $data = TransactionType::findOrFail($id);
            $data->update($request->validated());

            return response()->json([
                'data' => $data,
                'message' => 'បានកែប្រែជោគជ័យ',
            ]);
        } catch (\Exception $e) {
            return response()->json(['errors' => true, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        $data = TransactionType::find($id);
        if (! $data) {
            return response()->json(['errors' => true, 'message' => 'រកមិនឃើញទិន្នន័យ']);
        }
        $data->delete();

        return response()->json([
            'message' => 'លុបជោគជ័យ',
        ]);
    }

    public function changeStatus(Request $request, $id)
    {
        $data = TransactionType::find($id);
        if (! $data) {
            return response()->json(['errors' => true, 'message' => 'រកមិនឃើញទិន្នន័យ']);
        }
        $data->is_active = $request->is_active;
        $data->save();

        return response()->json(['message' => 'ប្តូរស្ថានភាពជោគជ័យ']);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->ids ?? [];
        TransactionType::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'លុបជោគជ័យ',
        ]);
    }

    public function deleteAll()
    {
        TransactionType::query()->delete();

        return response()->json([
            'message' => 'លុបទាំងអស់ជោគជ័យ',
        ]);
    }
}
