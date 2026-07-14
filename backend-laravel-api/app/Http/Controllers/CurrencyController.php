<?php

namespace App\Http\Controllers;

use App\Http\Requests\CurrencyRequest;
use App\Services\CurrencyService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CurrencyController extends Controller implements HasMiddleware
{
    protected $currencyService;

    public function __construct(CurrencyService $currencyService)
    {
        $this->currencyService = $currencyService;
    }

    public static function middleware(): array
    {
        return [
            new Middleware('permission:currencies.read', only: ['index', 'show', 'stats']),
            new Middleware('permission:currencies.create', only: ['store']),
            new Middleware('permission:currencies.update', only: ['update', 'changeStatus']),
            new Middleware('permission:currencies.delete', only: ['destroy', 'bulkDelete', 'deleteAll']),
        ];
    }

    // LIST
    public function index(Request $request)
    {
        $paginator = $this->currencyService->getAll($request);

        return $this->paginatedResponse(
            $paginator->items(),
            $paginator->total()
        );
    }

    // STATS
    public function stats()
    {
        $stats = $this->currencyService->getStats();
        return response()->json([
            'stats' => $stats
        ]);
    }

    // STORE
    public function store(CurrencyRequest $request)
    {
        $currency = $this->currencyService->createCurrency($request->validated());

        return $this->successResponse($currency, 'បានបង្កើតរូបិយប័ណ្ណដោយជោគជ័យ', 201);
    }

    // SHOW
    public function show(string $id)
    {
        $currency = $this->currencyService->findById($id);
        return $this->successResponse($currency);
    }

    // UPDATE
    public function update(CurrencyRequest $request, string $id)
    {
        $currency = $this->currencyService->updateCurrency($request->validated(), $id);

        return $this->successResponse($currency, 'បានកែប្រែរូបិយប័ណ្ណដោយជោគជ័យ');
    }

    // DELETE
    public function destroy(string $id)
    {
        try {
            $currency = $this->currencyService->deleteCurrency($id);
            return $this->successResponse($currency, 'បានលុបរូបិយប័ណ្ណដោយជោគជ័យ');
        } catch (\Exception $e) {
            return $this->errorResponse('លុបមិនបានជោគជ័យ: '.$e->getMessage(), 400);
        }
    }

    // CHANGE STATUS
    public function changeStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $currency = $this->currencyService->changeStatus($id, $request->input('status'));

        return $this->successResponse($currency, 'បានប្តូរស្ថានភាពដោយជោគជ័យ');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:currencies,id',
        ]);

        $this->currencyService->bulkDelete($request->ids);

        return $this->successResponse(null, 'លុបជោគជ័យ');
    }

    public function deleteAll()
    {
        $this->currencyService->deleteAll();

        return $this->successResponse(null, 'លុបទាំងអស់ជោគជ័យ');
    }
}