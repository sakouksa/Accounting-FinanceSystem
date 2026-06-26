<?php

namespace App\Repositories;

use App\Models\Budget;

class BudgetRepository
{
    public function getPaginatedList(array $filters, $limit = 10)
    {
        $query = Budget::with([
            'account:id,account_name,account_code',
            'branch:id,name',
        ]);

        if (! empty($filters['txt_search'])) {
            $search = $filters['txt_search'];

            $query->where(function ($q) use ($search) {
                $q->where('budget_name', 'LIKE', "%{$search}%")
                    ->orWhere('fiscal_year', 'LIKE', "%{$search}%");
            });
        }

        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['account_id'])) {
            $query->where('account_id', $filters['account_id']);
        }

        if (! empty($filters['branch_id'])) {
            $query->where('branch_id', $filters['branch_id']);
        }
        if (! empty($filters['from_date']) && ! empty($filters['to_date'])) {
            $query->whereBetween('start_date', [$filters['from_date'], $filters['to_date']]);
        }

        return $query->latest()->paginate($limit);
    }

    public function getStats()
    {
        return [
            'total_budget' => Budget::count(),
            'active_budget' => Budget::where('status', 'active')->count(),
            'inactive_budget' => Budget::where('status', 'closed')->count(),
            'allocated_amount' => Budget::sum('allocated_amount'),
            'used_amount' => Budget::sum('used_amount'),
            'remaining_amount' => Budget::sum('remaining_amount'),
        ];
    }

    public function findById($id)
    {
        return Budget::with([
            'account:id,account_name,account_code',
            'branch:id,name',
        ])->findOrFail($id);
    }

    public function createBudget(array $data)
    {
        return Budget::create($data);
    }

    public function updateBudget(array $data, $id)
    {
        $budget = Budget::findOrFail($id);

        $budget->update($data);

        return $budget;
    }

    public function deleteBudget($id)
    {
        $budget = Budget::findOrFail($id);

        $budget->delete();

        return $budget;
    }

    public function changeStatus($id, $status)
    {
        $budget = Budget::findOrFail($id);

        $budget->status = $status;
        $budget->save();

        return $budget;
    }

    public function bulkDelete(array $ids)
    {
        return Budget::whereIn('id', $ids)->delete();
    }

    public function deleteAll()
    {
        return Budget::query()->delete();
    }
}
