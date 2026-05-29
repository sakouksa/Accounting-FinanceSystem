<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Transaction::query();

            if ($request->filled('txt_search')) {
                $search = trim($request->txt_search);

                $query->where(function ($q) use ($search) {
                    $q->where('transaction_no', 'LIKE', "%{$search}%")
                        ->orWhere('transaction_type', 'LIKE', "%{$search}%")
                        ->orWhere('description', 'LIKE', "%{$search}%");
                });
            }

            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            if ($request->filled('branch_id')) {
                $query->where('branch_id', $request->branch_id);
            }

            if ($request->filled('currency_code')) {
                $query->where('currency_code', $request->currency_code);
            }

            if ($request->filled('transaction_type')) {
                $query->where('transaction_type', $request->transaction_type);
            }

            $perPage = $request->get('limit', 20);

            $list = $query->with([
                'branch',
                'details',
            ])
                ->orderBy('id', 'desc')
                ->paginate($perPage);

            return response()->json([
                'list' => $list->items(),
                'total' => $list->total(),
            ]);
        } catch (\Exception $e) {

            \Log::error('Transaction Error: '.$e->getMessage());

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
                'title' => 'ប្រតិបត្តិការសរុប',
                'value' => Transaction::count(),
                'color' => '#6366f1',
                'icon' => 'DatabaseOutlined',
            ],
            [
                'title' => 'រង់ចាំ',
                'value' => Transaction::where('status', 'Pending')->count(),
                'color' => '#f59e0b',
                'icon' => 'ClockCircleOutlined',
            ],
            [
                'title' => 'អនុម័ត',
                'value' => Transaction::where('status', 'Approved')->count(),
                'color' => '#10b981',
                'icon' => 'CheckCircleOutlined',
            ],
            [
                'title' => 'បង្កើតថ្ងៃនេះ',
                'value' => Transaction::whereDate('created_at', today())->count(),
                'color' => '#3b82f6',
                'icon' => 'CalendarOutlined',
            ],
        ];

        return response()->json([
            'stats' => $stats,
        ]);
    }

    public function store(TransactionRequest $request)
    {
        try {

            $transaction = Transaction::create($request->validated());

            return response()->json([
                'data' => $transaction->load([
                    'branch',
                    'details',
                ]),
                'message' => 'បានបង្កើតប្រតិបត្តិការជោគជ័យ',
            ]);
        } catch (\Exception $e) {

            \Log::error('Create Transaction Error: '.$e->getMessage());

            return response()->json([
                'errors' => true,
                'message' => 'បង្កើតមិនបានជោគជ័យ: '.$e->getMessage(),
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {

            $transaction = Transaction::with([
                'branch',
                'details',
            ])->findOrFail($id);

            return response()->json([
                'data' => $transaction,
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'errors' => true,
                'message' => 'រកមិនឃើញទិន្នន័យ',
            ], 404);
        }
    }

    public function update(TransactionRequest $request, string $id)
    {
        try {

            $transaction = Transaction::findOrFail($id);

            $transaction->update($request->validated());

            return response()->json([
                'data' => $transaction->load([
                    'branch',
                    'details',
                ]),
                'message' => 'បានកែប្រែប្រតិបត្តិការជោគជ័យ',
            ]);
        } catch (\Exception $e) {

            \Log::error('Update Transaction Error: '.$e->getMessage());

            return response()->json([
                'errors' => true,
                'message' => 'កែប្រែមិនបានជោគជ័យ: '.$e->getMessage(),
            ], 500);
        }
    }

    public function destroy(string $id)
    {
        $transaction = Transaction::find($id);

        if (! $transaction) {
            return response()->json([
                'error' => true,
                'message' => 'រកមិនឃើញប្រតិបត្តិការ',
            ]);
        }

        $transaction->delete();

        return response()->json([
            'message' => 'លុបជោគជ័យ',
        ]);
    }

    public function changeStatus(Request $request, $id)
    {
        $transaction = Transaction::find($id);

        if (! $transaction) {
            return response()->json([
                'error' => true,
                'message' => 'រកមិនឃើញប្រតិបត្តិការ',
            ]);
        }

        $transaction->status = $request->status;

        if ($request->status == 'Approved') {
            $transaction->approved_by = auth()->id();
            $transaction->approved_at = now();
        }

        $transaction->save();

        return response()->json([
            'message' => 'ប្តូរស្ថានភាពជោគជ័យ',
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->ids ?? [];

        Transaction::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'លុបជោគជ័យ',
        ]);
    }

    public function deleteAll()
    {
        Transaction::query()->delete();

        return response()->json([
            'message' => 'លុបទាំងអស់ជោគជ័យ',
        ]);
    }
}
