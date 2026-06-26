<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\AccountsReceivable;
use App\Models\AccountsPayable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HomeController extends Controller
{
    public function dashboard()
    {
        // --- ១. ការគណនា Statistics & ភាគរយធៀបនឹងខែមុន (MoM Growth) ---
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;
        $lastMonth = Carbon::now()->subMonth()->month;
        $lastMonthYear = Carbon::now()->subMonth()->year;

        // ក. ចំណូលសរុប (Total Revenue)
        $totalRevenue = Payment::where('status', 'completed')->sum('amount');
        $currentMonthRevenue = Payment::where('status', 'completed')
            ->whereMonth('payment_date', $currentMonth)
            ->whereYear('payment_date', $currentYear)
            ->sum('amount');
        $lastMonthRevenue = Payment::where('status', 'completed')
            ->whereMonth('payment_date', $lastMonth)
            ->whereYear('payment_date', $lastMonthYear)
            ->sum('amount');

        $revenueDiffPercent = $lastMonthRevenue > 0
            ? (($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100
            : 0;

        // ខ. អ្នកប្រើប្រាស់សកម្ម (Active Users)
        $activeUsers = User::where('status', 'active')->count();

        // គ. ប្រតិបត្តិការសរុប (Total Transactions)
        $totalTransactions = Transaction::count();
        $currentMonthTrx = Transaction::whereMonth('created_at', $currentMonth)->whereYear('created_at', $currentYear)->count();
        $lastMonthTrx = Transaction::whereMonth('created_at', $lastMonth)->whereYear('created_at', $lastMonthYear)->count();

        $trxDiffPercent = $lastMonthTrx > 0
            ? (($currentMonthTrx - $lastMonthTrx) / $lastMonthTrx) * 100
            : 0;

        // ឃ. ការចូលមើលប្រព័ន្ធ (System Audit Access Views)
        $pageViews = 28400;

        // --- ២. Revenue Chart (ទាញតាមខែនីមួយៗក្នុងឆ្នាំបច្ចុប្បន្ន) ---
        $monthlyRevenue = Payment::select(
            DB::raw('MONTH(payment_date) as month'),
            DB::raw('SUM(amount) as total')
        )
            ->whereYear('payment_date', $currentYear)
            ->where('status', 'completed')
            ->groupBy(DB::raw('MONTH(payment_date)'))
            ->orderBy('month')
            ->get();

        $chartLabels = [];
        $chartData = [];
        for ($i = 1; $i <= 12; $i++) {
            $chartLabels[] = date('M', mktime(0, 0, 0, $i, 1));
            $chartData[] = (float)($monthlyRevenue->firstWhere('month', $i)->total ?? 0);
        }

        // --- ៣. Traffic Sources (ប្រភពទិន្នន័យគណនេយ្យ) ---
        $trafficSources = [45, 30, 15, 10];

        // --- ៤. Recent Transactions (កែប្រែដោយប្រើ ?-> ការពារ Error 500) ---
        $recentTransactions = Transaction::with(['payment.accountsReceivable.customer'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($row) {
                // ប្រើ Nullsafe Operator ដើម្បីសុវត្ថិភាពខ្ពស់
                $customer = $row->payment?->accountsReceivable?->customer;

                return [
                    'key' => (string)$row->id,
                    'name' => $customer ? $customer->customer_name : 'General Customer / Non-AR',
                    'email' => $customer ? $customer->email : 'N/A',
                    'avatar' => '',
                    'transaction_no' => $row->transaction_no,
                    'description' => $row->description ?? 'No Description Provided',
                    'status' => $row->status ?? 'pending',
                    'amount' => (float)($row->total_debit ?? 0),
                ];
            });

        // --- ៥. Recent Activities (Audit Logs) ---
        $activities = Transaction::with(['transactionType'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($row) {
                return [
                    'title' => $row->transactionType?->name ?? 'Journal Voucher Posted',
                    'desc' => $row->description ?? "Ref No: {$row->transaction_no}",
                    'time' => $row->created_at ? $row->created_at->diffForHumans() : 'Just now',
                    'type' => $row->transactionType?->code ?? 'JV'
                ];
            });

        // --- ៦. AR/AP Summary ---
        $receivable = AccountsReceivable::sum('balance_amount');
        $payable = AccountsPayable::sum('balance_amount');

        $totalArAp = ($receivable + $payable) ?: 1;
        $arPercent = round(($receivable / $totalArAp) * 100);
        $apPercent = round(($payable / $totalArAp) * 100);

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'totalRevenue' => (float)$totalRevenue,
                    'revenuePercent' => number_format($revenueDiffPercent, 1),
                    'isRevenueUp' => $revenueDiffPercent >= 0,
                    'activeUsers' => $activeUsers,
                    'totalTransactions' => $totalTransactions,
                    'trxPercent' => number_format($trxDiffPercent, 1),
                    'isTrxUp' => $trxDiffPercent >= 0,
                    'pageViews' => $pageViews,
                    'receivable' => (float)$receivable,
                    'payable' => (float)$payable,
                    'arPercent' => $arPercent,
                    'apPercent' => $apPercent
                ],
                'overviewChart' => [
                    'labels' => $chartLabels,
                    'data' => $chartData,
                ],
                'trafficSources' => $trafficSources,
                'recentTransactions' => $recentTransactions,
                'recentActivities' => $activities,
            ]
        ]);
    }
}