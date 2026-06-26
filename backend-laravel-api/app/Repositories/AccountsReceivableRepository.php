<?php

namespace App\Repositories;

use App\Models\AccountsReceivable;

class AccountsReceivableRepository
{
    public function getAll($request)
    {
        $query = AccountsReceivable::with('customer');

        if ($request->filled('txt_search')) {
            $search = trim($request->txt_search);

            $query->where(function ($q) use ($search) {
                $q->where('invoice_no', 'LIKE', "%{$search}%")
                    ->orWhere('invoice_no', 'LIKE', '%'.strtoupper($search).'%')
                    ->orWhereHas('customer', function ($customerQuery) use ($search) {
                        $customerQuery->where('customer_name', 'LIKE', "%{$search}%");
                    });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->filled('from_date') && $request->filled('to_date')) {
            $query->whereBetween('invoice_date', [
                $request->from_date,
                $request->to_date,
            ]);
        }

        $limit = $request->get('limit', 10);

        return $query->latest()->paginate($limit);
    }

    public function getStats()
    {
        return [
            'total_unpaid' => AccountsReceivable::where('status', 'unpaid')->count(),
            'total_partial' => AccountsReceivable::where('status', 'partial')->count(),
            'total_paid' => AccountsReceivable::where('status', 'paid')->count(),
            'sum_balance' => AccountsReceivable::sum('balance_amount'),
        ];
    }

    public function findById($id)
    {
        return AccountsReceivable::with('customer')->findOrFail($id);
    }

    public function createAR(array $data)
    {
        return AccountsReceivable::create($data);
    }

    public function updateAR(array $data, $id)
    {
        $ar = AccountsReceivable::findOrFail($id);
        $ar->update($data);

        return $ar;
    }

    public function deleteAR($id)
    {
        $ar = AccountsReceivable::findOrFail($id);
        $ar->delete();

        return $ar;
    }

    public function changeStatus($id, $status)
    {
        $ar = AccountsReceivable::findOrFail($id);
        $ar->status = $status;
        $ar->save();

        return $ar;
    }

    public function bulkDelete(array $ids)
    {
        return AccountsReceivable::whereIn('id', $ids)->delete();
    }

    public function deleteAll()
    {
        return AccountsReceivable::query()->delete();
    }
}
