<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentMethodRequest;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PaymentMethodController extends Controller
{
    // LIST
    public function index(Request $request)
    {
        $query = PaymentMethod::query();

        // filter by id
        if ($request->has('id')) {
            $query->where('id', $request->input('id'));
        }

        // search
        if ($request->has('txt_search')) {

            $search = $request->input('txt_search');

            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', '%'.$search.'%')
                    ->orWhere('account_name', 'LIKE', '%'.$search.'%')
                    ->orWhere('account_number', 'LIKE', '%'.$search.'%');
            });
        }

        // status
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $list = $query->orderBy('id', 'desc')->get();

        return response()->json([
            'list' => $list,
            'total' => $list->count(),
        ]);
    }

    // STATS
    public function stats()
    {
        $stats = [
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

        return response()->json([
            'stats' => $stats,
        ]);
    }

    // STORE
    public function store(PaymentMethodRequest $request)
    {
        $data = $request->validated();

        // upload qr image
        if ($request->hasFile('qr_code')) {

            $file = $request->file('qr_code');

            $filename = time().'_'.$file->getClientOriginalName();

            $path = $file->storeAs(
                'payment-methods',
                $filename,
                'public'
            );

            $data['qr_code'] = $path;
        }

        $paymentMethod = PaymentMethod::create($data);

        return response()->json([
            'data' => $paymentMethod,
            'message' => 'បានបង្កើតវិធីបង់ប្រាក់ដោយជោគជ័យ',
        ], 201);
    }

    // SHOW
    public function show(string $id)
    {
        $paymentMethod = PaymentMethod::find($id);

        if (! $paymentMethod) {
            return response()->json([
                'message' => 'រកមិនឃើញវិធីបង់ប្រាក់',
            ], 404);
        }

        return response()->json([
            'data' => $paymentMethod,
        ]);
    }

    // UPDATE
    public function update(PaymentMethodRequest $request, string $id)
    {
        $paymentMethod = PaymentMethod::findOrFail($id);

        $data = $request->validated();

        // upload new qr image
        if ($request->hasFile('qr_code')) {

            // delete old image
            if (
                $paymentMethod->qr_code &&
                Storage::disk('public')->exists($paymentMethod->qr_code)
            ) {
                Storage::disk('public')->delete($paymentMethod->qr_code);
            }

            $file = $request->file('qr_code');

            $filename = time().'_'.$file->getClientOriginalName();

            $path = $file->storeAs(
                'payment-methods',
                $filename,
                'public'
            );

            $data['qr_code'] = $path;
        }

        $paymentMethod->update($data);

        return response()->json([
            'data' => $paymentMethod,
            'message' => 'បានកែប្រែវិធីបង់ប្រាក់ដោយជោគជ័យ',
        ]);
    }

    // DELETE
    public function destroy(string $id)
    {
        $paymentMethod = PaymentMethod::find($id);

        if (! $paymentMethod) {
            return response()->json([
                'message' => 'រកមិនឃើញវិធីបង់ប្រាក់',
            ], 404);
        }

        // delete image
        if (
            $paymentMethod->qr_code &&
            Storage::disk('public')->exists($paymentMethod->qr_code)
        ) {
            Storage::disk('public')->delete($paymentMethod->qr_code);
        }

        $paymentMethod->delete();

        return response()->json([
            'data' => $paymentMethod,
            'message' => 'បានលុបវិធីបង់ប្រាក់ដោយជោគជ័យ',
        ]);
    }

    // CHANGE STATUS
    public function changeStatus(Request $request, string $id)
    {
        $paymentMethod = PaymentMethod::find($id);

        if (! $paymentMethod) {
            return response()->json([
                'message' => 'រកមិនឃើញវិធីបង់ប្រាក់',
            ], 404);
        }

        $paymentMethod->status = $request->input('status');
        $paymentMethod->save();

        return response()->json([
            'data' => $paymentMethod,
            'message' => 'បានប្តូរស្ថានភាពដោយជោគជ័យ',
        ]);
    }

    // BULK DELETE
    public function bulkDelete(Request $request)
    {
        $ids = $request->ids;

        $paymentMethods = PaymentMethod::whereIn('id', $ids)->get();

        foreach ($paymentMethods as $item) {

            // delete image
            if (
                $item->qr_code &&
                Storage::disk('public')->exists($item->qr_code)
            ) {
                Storage::disk('public')->delete($item->qr_code);
            }

            $item->delete();
        }

        return response()->json([
            'message' => 'លុបជោគជ័យ',
        ]);
    }

    // DELETE ALL
    public function deleteAll()
    {
        $paymentMethods = PaymentMethod::all();

        foreach ($paymentMethods as $item) {

            // delete image
            if (
                $item->qr_code &&
                Storage::disk('public')->exists($item->qr_code)
            ) {
                Storage::disk('public')->delete($item->qr_code);
            }
        }

        PaymentMethod::truncate();

        return response()->json([
            'message' => 'លុបទាំងអស់ជោគជ័យ',
        ]);
    }
}
