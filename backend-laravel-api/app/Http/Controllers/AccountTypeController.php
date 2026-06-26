<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccountTypeRequest;
use App\Models\AccountType;
use Illuminate\Http\Request;

class AccountTypeController extends Controller
{
    // LIST
    public function index(Request $request)
    {
        $query = AccountType::query();

        if ($request->has('id')) {
            $query->where('id', $request->input('id'));
        }

        if ($request->has('txt_search')) {
            $search = $request->input('txt_search');

            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%$search%")
                    ->orWhere('code', 'LIKE', "%$search%")
                    ->orWhere('description', 'LIKE', "%$search%");
            });
        }

        $limit = $request->get('limit', 10);

        $paginator = $query->orderBy('id', 'desc')->paginate($limit);

        return response()->json([
            'list' => $paginator->items(),
            'total' => $paginator->total(),
        ]);
    }

    // STATS
    public function stats()
    {
        return response()->json([
            'stats' => [
                [
                    'title' => 'ប្រភេទគណនីសរុប',
                    'value' => AccountType::count(),
                    'color' => '#6366f1',
                    'icon' => 'BankOutlined',
                ],
                [
                    'title' => 'Debit',
                    'value' => AccountType::where('normal_balance', 'debit')->count(),
                    'color' => '#10b981',
                    'icon' => 'ArrowDownOutlined',
                ],
                [
                    'title' => 'Credit',
                    'value' => AccountType::where('normal_balance', 'credit')->count(),
                    'color' => '#f59e0b',
                    'icon' => 'ArrowUpOutlined',
                ],
                [
                    'title' => 'Today',
                    'value' => AccountType::whereDate('created_at', today())->count(),
                    'color' => '#ef4444',
                    'icon' => 'CalendarOutlined',
                ],
            ],
        ]);
    }

    // STORE (USING REQUEST)
    public function store(AccountTypeRequest $request)
    {
        $accountType = AccountType::create($request->validated());

        return response()->json([
            'data' => $accountType,
            'message' => 'បានបង្កើត Account Type ជោគជ័យ',
        ], 201);
    }

    // SHOW
    public function show(string $id)
    {
        $accountType = AccountType::find($id);

        if (! $accountType) {
            return response()->json([
                'message' => 'រកមិនឃើញ Account Type',
            ], 404);
        }

        return response()->json([
            'data' => $accountType,
        ]);
    }

    // UPDATE (USING REQUEST)
    public function update(AccountTypeRequest $request, string $id)
    {
        $accountType = AccountType::find($id);

        if (! $accountType) {
            return response()->json([
                'message' => 'រកមិនឃើញ Account Type',
            ], 404);
        }

        $accountType->update($request->validated());

        return response()->json([
            'data' => $accountType,
            'message' => 'បានកែប្រែ Account Type ជោគជ័យ',
        ]);
    }

    // DELETE
    public function destroy(string $id)
    {
        $accountType = AccountType::find($id);

        if (! $accountType) {
            return response()->json([
                'message' => 'រកមិនឃើញ Account Type',
            ], 404);
        }

        $accountType->delete();

        return response()->json([
            'data' => $accountType,
            'message' => 'បានលុបជោគជ័យ',
        ]);
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        AccountType::whereIn('id', $request->ids ?? [])->delete();

        return response()->json([
            'message' => 'លុបជាច្រើនជោគជ័យ',
        ]);
    }

    // DELETE ALL
    public function deleteAll()
    {
        AccountType::query()->delete();

        return response()->json([
            'message' => 'លុបទាំងអស់ជោគជ័យ',
        ]);
    }
}
