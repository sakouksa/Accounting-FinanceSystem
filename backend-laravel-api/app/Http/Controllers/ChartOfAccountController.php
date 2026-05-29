<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChartOfAccountRequest;
use App\Models\AccountType;
use App\Models\ChartOfAccount;
use Illuminate\Http\Request;

class ChartOfAccountController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = ChartOfAccount::query();

            if ($request->filled('txt_search')) {
                $search = trim($request->txt_search);
                $query->where(function ($q) use ($search) {
                    $q->where('account_code', 'LIKE', "%{$search}%")
                        ->orWhere('account_name', 'LIKE', "%{$search}%");
                });
            }

            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            if ($request->filled('account_type_id')) {
                $query->where('account_type_id', $request->account_type_id);
            }

            if ($request->filled('parent_account_id')) {
                $query->where('parent_account_id', $request->parent_account_id);
            }

            $perPage = $request->get('limit', 20);

            $list = $query->with(['accountType', 'parent'])
                ->orderBy('account_code', 'asc')
                ->paginate($perPage);

            return response()->json([
                'list' => $list->items(),
                'total' => $list->total(),
                'account_types' => AccountType::select('id as account_type_id', 'name', 'code')->get(),
            ]);
        } catch (\Exception $e) {
            \Log::error('ChartOfAccount Error: '.$e->getMessage());

            return response()->json([
                'errors' => true,
                'message' => 'ទាញទិន្នន័យបរាជ័យ: '.$e->getMessage(),
            ], 500);
        }
    }

    public function stats()
    {
        $stats = [
            [
                'title' => 'គណនីសរុប',
                'value' => ChartOfAccount::count(),
                'color' => '#6366f1',
                'icon' => 'AccountBookOutlined',
            ],
            [
                'title' => 'សកម្ម',
                'value' => ChartOfAccount::where('status', 'Active')->count(),
                'color' => '#10b981',
                'icon' => 'CheckCircleOutlined',
            ],
            [
                'title' => 'អសកម្ម',
                'value' => ChartOfAccount::where('status', 'Inactive')->count(),
                'color' => '#ef4444',
                'icon' => 'CloseCircleOutlined',
            ],
            [
                'title' => 'បង្កើតថ្ងៃនេះ',
                'value' => ChartOfAccount::whereDate('created_at', today())->count(),
                'color' => '#f59e0b',
                'icon' => 'CalendarOutlined',
            ],
        ];

        return response()->json(['stats' => $stats]);
    }

    public function store(ChartOfAccountRequest $request)
    {
        $account = ChartOfAccount::create($request->validated());

        return response()->json([
            'data' => $account->load(['accountType', 'parent']),
            'message' => 'បានបង្កើតគណនីដោយជោគជ័យ',
        ]);
    }

    public function update(ChartOfAccountRequest $request, string $id)
    {
        try {
            $account = ChartOfAccount::findOrFail($id);
            $account->update($request->validated());

            return response()->json([
                'data' => $account->load(['accountType', 'parent']),
                'message' => 'បានកែប្រែគណនីដោយជោគជ័យ',
            ]);
        } catch (\Exception $e) {
            \Log::error('Update ChartOfAccount Error: '.$e->getMessage());

            return response()->json([
                'errors' => true,
                'message' => 'កែប្រែមិនបានជោគជ័យ: '.$e->getMessage(),
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        $account = ChartOfAccount::find($id);
        if (! $account) {
            return response()->json(['error' => true, 'message' => 'រកមិនឃើញគណនី']);
        }

        if ($account->children()->count() > 0) {
            return response()->json(['error' => true, 'message' => 'មិនអាចលុបគណនីដែលមានគណនីកូន']);
        }

        $account->delete();

        return response()->json(['message' => 'លុបជោគជ័យ']);
    }

    public function changeStatus(Request $request, $id)
    {
        $account = ChartOfAccount::find($id);
        if (! $account) {
            return response()->json(['error' => true, 'message' => 'រកមិនឃើញគណនី']);
        }

        $account->status = $request->status;
        $account->save();

        return response()->json(['message' => 'ប្តូរស្ថានភាពជោគជ័យ']);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->ids ?? [];
        ChartOfAccount::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'លុបជោគជ័យ']);
    }

    public function deleteAll()
    {
        ChartOfAccount::query()->delete();

        return response()->json(['message' => 'លុបទាំងអស់ជោគជ័យ']);
    }
}
