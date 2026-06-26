<?php

namespace App\Repositories;

use App\Models\CashFlow;
use Illuminate\Support\Facades\DB;

class CashFlowRepository
{
    public function getPaginatedList(array $filters, $limit = 10)
    {
        $query = CashFlow::with([
            'transaction:id,transaction_no',
            'account:id,account_name,account_code',
        ]);

        if (! empty($filters['txt_search'])) {
            $search = $filters['txt_search'];

            $query->where('description', 'LIKE', "%{$search}%");
        }

        if (! empty($filters['from_date']) && ! empty($filters['to_date'])) {
            $query->whereBetween('flow_date', [
                $filters['from_date'],
                $filters['to_date'],
            ]);
        }

        if (! empty($filters['flow_type'])) {
            $query->where('flow_type', $filters['flow_type']);
        }

        if (! empty($filters['account_id'])) {
            $query->where('account_id', $filters['account_id']);
        }

        if (! empty($filters['transaction_id'])) {
            $query->where('transaction_id', $filters['transaction_id']);
        }

        return $query
            ->orderBy('flow_date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate($limit);
    }

    public function getStats()
    {
        $totals = CashFlow::selectRaw("
            SUM(CASE WHEN flow_type = 'inflow' THEN amount ELSE 0 END) as total_inflow,
            SUM(CASE WHEN flow_type = 'outflow' THEN amount ELSE 0 END) as total_outflow
        ")->first();

        $netCashFlow = ($totals->total_inflow ?? 0) - ($totals->total_outflow ?? 0);

        return [
            'total_inflow' => (float) ($totals->total_inflow ?? 0),
            'total_outflow' => (float) ($totals->total_outflow ?? 0),
            'net_cash_flow' => (float) $netCashFlow,
        ];
    }

    public function findById($id)
    {
        return CashFlow::with([
            'transaction:id,transaction_no',
            'account:id,account_name,account_code',
        ])->findOrFail($id);
    }

    public function createCashFlow(array $data)
    {
        return DB::transaction(function () use ($data) {
            return CashFlow::create($data);
        });
    }

    public function updateCashFlow(array $data, $id)
    {
        return DB::transaction(function () use ($data, $id) {
            $cashFlow = CashFlow::findOrFail($id);
            $cashFlow->update($data);

            return $cashFlow;
        });
    }

    public function deleteCashFlow($id)
    {
        return DB::transaction(function () use ($id) {
            $cashFlow = CashFlow::findOrFail($id);
            $cashFlow->delete();

            return $cashFlow;
        });
    }

    public function bulkDelete(array $ids)
    {
        return CashFlow::whereIn('id', $ids)->delete();
    }

    public function deleteAll()
    {
        return CashFlow::truncate();
    }
}
