<?php

namespace App\Repositories;

use App\Models\PaymentMethod;
use Illuminate\Support\Facades\Storage;

class PaymentMethodRepository
{
    public function getAll($request)
    {
        $query = PaymentMethod::query();

        if ($request->filled('id')) {
            $query->where('id', $request->id);
        }

        if ($request->filled('txt_search')) {
            $search = trim($request->txt_search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('account_name', 'LIKE', "%{$search}%")
                  ->orWhere('account_number', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $limit = $request->get('limit', 10);
        return $query->orderBy('id', 'desc')->paginate($limit);
    }

    public function getStats()
    {
        return [
            [
                'title' => 'វិធីបង់ប្រាក់សរុប',
                'value' => PaymentMethod::count(),
                'color' => '#6366f1',
                'icon' => 'CreditCardOutlined',
            ],
            [
                'title' => 'កំពុងប្រើ',
                'value' => PaymentMethod::where('status', 'active')->count(),
                'color' => '#10b981',
                'icon' => 'CheckCircleOutlined',
            ],
            [
                'title' => 'មិនប្រើ',
                'value' => PaymentMethod::where('status', 'inactive')->count(),
                'color' => '#ef4444',
                'icon' => 'CloseCircleOutlined',
            ],
            [
                'title' => 'បង្កើតថ្ងៃនេះ',
                'value' => PaymentMethod::whereDate('created_at', today())->count(),
                'color' => '#f59e0b',
                'icon' => 'CalendarOutlined',
            ],
        ];
    }

    public function findById($id)
    {
        return PaymentMethod::findOrFail($id);
    }

    public function createPaymentMethod(array $data)
    {
        return PaymentMethod::create($data);
    }

    public function updatePaymentMethod(array $data, $id)
    {
        $paymentMethod = PaymentMethod::findOrFail($id);
        $paymentMethod->update($data);
        return $paymentMethod;
    }

    public function deletePaymentMethod($id)
    {
        $paymentMethod = PaymentMethod::findOrFail($id);
        if ($paymentMethod->qr_code && Storage::disk('public')->exists($paymentMethod->qr_code)) {
            Storage::disk('public')->delete($paymentMethod->qr_code);
        }
        $paymentMethod->delete();
        return $paymentMethod;
    }

    public function changeStatus($id, $status)
    {
        $paymentMethod = PaymentMethod::findOrFail($id);
        $paymentMethod->status = $status;
        $paymentMethod->save();
        return $paymentMethod;
    }

    public function bulkDelete(array $ids)
    {
        $items = PaymentMethod::whereIn('id', $ids)->get();
        foreach ($items as $item) {
            if ($item->qr_code && Storage::disk('public')->exists($item->qr_code)) {
                Storage::disk('public')->delete($item->qr_code);
            }
            $item->delete();
        }
        return true;
    }

    public function deleteAll()
    {
        $items = PaymentMethod::all();
        foreach ($items as $item) {
            if ($item->qr_code && Storage::disk('public')->exists($item->qr_code)) {
                Storage::disk('public')->delete($item->qr_code);
            }
            $item->delete();
        }
        return true;
    }
}
