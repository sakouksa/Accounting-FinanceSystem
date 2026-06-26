<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionDetailRequest;
use App\Models\ChartOfAccount;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;

class TransactionDetailController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = TransactionDetail::query();

            // filter by transaction
            if ($request->filled('transaction_id')) {
                $query->where('transaction_id', $request->transaction_id);
            }

            // filter by account
            if ($request->filled('account_id')) {
                $query->where('account_id', $request->account_id);
            }

            // search
            if ($request->filled('txt_search')) {
                $search = $request->txt_search;

                $query->where(function ($q) use ($search) {
                    $q->where('description', 'like', "%$search%")
                        ->orWhere('id', 'like', "%$search%");
                });
            }

            $list = $query
                ->with(['transaction', 'account'])
                ->orderBy('id', 'desc')
                ->paginate($request->get('limit', 20));

            return response()->json([
                'list' => $list->items(),
                'total' => $list->total(),
                'transaction' => Transaction::all(),
                'account' => ChartOfAccount::all(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'errors' => true,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function stats()
    {
        $stats = [[
            'title' => 'សរុប',
            'value' => TransactionDetail::count(),
            'color' => '#6366f1',
            'icon' => 'DatabaseOutlined',
        ], [
            'title' => 'សរុប Debit',
            'value' => TransactionDetail::sum('debit_amount'),
            'color' => '#10b981',
            'icon' => 'ArrowDownOutlined',
        ], [
            'title' => 'សរុប Credit',
            'value' => TransactionDetail::sum('credit_amount'),
            'color' => '#f59e0b',
            'icon' => 'ArrowUpOutlined',
        ], [
            'title' => 'បង្កើតថ្ងៃនេះ',
            'value' => TransactionDetail::whereDate('created_at', today())->count(),
            'color' => '#3b82f6',
            'icon' => 'CalendarOutlined',
        ]];

        return response()->json(['stats' => $stats]);
    }

    public function store(TransactionDetailRequest $request)
    {
        try {
            $data = TransactionDetail::create($request->validated());

            return response()->json(['data' => $data->load(['transaction', 'account']), 'message' => 'បានបង្កើតជោគជ័យ']);
        } catch (\Exception $e) {
            return response()->json([
                'errors' => true,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $data = TransactionDetail::with(['transaction', 'account'])->findOrFail($id);

            return response()->json(['data' => $data]);
        } catch (\Exception $e) {
            return response()->json([
                'errors' => true,
                'message' => 'រកមិនឃើញទិន្នន័យ',
            ], 404);
        }
    }

    public function update(TransactionDetailRequest $request, string $id)
    {
        try {
            $data = TransactionDetail::findOrFail($id);
            $data->update($request->validated());

            return response()->json([
                'data' => $data->load(['transaction', 'account']),
                'message' => 'បានកែប្រែជោគជ័យ',
            ]);
        } catch (\Exception $e) {
            return response()->json(['errors' => true, 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        $data = TransactionDetail::find($id);
        if (! $data) {
            return response()->json([
                'errors' => true,
                'message' => 'រកមិនឃើញទិន្នន័យ',
            ], 404);
        }
        $data->delete();

        return response()->json([
            'message' => 'លុបជោគជ័យ',
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->ids ?? [];
        TransactionDetail::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'លុបជោគជ័យ',
        ]);
    }

    public function deleteAll()
    {
        TransactionDetail::query()->delete();

        return response()->json([
            'message' => 'លុបទាំងអស់ជោគជ័យ',
        ]);
    }
}
