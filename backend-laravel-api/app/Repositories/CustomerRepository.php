<?php

namespace App\Repositories;

use App\Models\Customer;
use Exception;

class CustomerRepository
{
    public function getAll($request)
    {
        $query = Customer::query();

        if ($request->filled('txt_search')) {
            $search = trim($request->txt_search);

            $query->where(function ($q) use ($search) {
                $q->where('customer_code', 'LIKE', "%{$search}%")
                    ->orWhere('customer_name', 'LIKE', "%{$search}%")
                    ->orWhere('phone', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $limit = $request->get('limit', 10);

        return $query->latest()->paginate($limit);
    }

    public function getStats()
    {
        return [
            [
                'title' => 'អតិថិជនសរុប',
                'value' => Customer::count(),
                'color' => '#6366f1',
                'icon' => 'UserOutlined',
            ],
            [
                'title' => 'សកម្ម',
                'value' => Customer::where('status', 'active')->count(),
                'color' => '#10b981',
                'icon' => 'CheckCircleOutlined',
            ],
            [
                'title' => 'អសកម្ម',
                'value' => Customer::where('status', 'inactive')->count(),
                'color' => '#ef4444',
                'icon' => 'CloseCircleOutlined',
            ],
            [
                'title' => 'បង្កើតថ្ងៃនេះ',
                'value' => Customer::whereDate('created_at', today())->count(),
                'color' => '#f59e0b',
                'icon' => 'CalendarOutlined',
            ],
        ];
    }

    public function findById($id)
    {
        return Customer::findOrFail($id);
    }

    public function createCustomer(array $data)
    {
        return Customer::create($data);
    }

    public function updateCustomer(array $data, $id)
    {
        $customer = Customer::findOrFail($id);

        $customer->update($data);

        return $customer;
    }

    public function deleteCustomer($id)
    {
        $customer = Customer::findOrFail($id);

        if ($customer->accountsReceivable()->exists()) {
            throw new Exception(
                'មិនអាចលុបអតិថិជននេះបានទេ ព្រោះអតិថិជននេះមានទិន្នន័យបំណុលកំពុងដំណើរការ។'
            );
        }

        $customer->delete();

        return $customer;
    }

    public function changeStatus($id, $status)
    {
        $customer = Customer::findOrFail($id);

        $customer->status = $status;
        $customer->save();

        return $customer;
    }

    public function bulkDelete(array $ids)
    {
        return Customer::whereIn('id', $ids)->delete();
    }

    public function deleteAll()
    {
        return Customer::query()->delete();
    }
}
