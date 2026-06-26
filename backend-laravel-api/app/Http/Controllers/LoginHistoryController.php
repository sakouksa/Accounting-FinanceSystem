<?php

namespace App\Http\Controllers;

use App\Models\LoginHistory;
use Illuminate\Http\Request;

class LoginHistoryController extends Controller
{
    public function index(Request $request)
    {
        $query = LoginHistory::with(['user:id,full_name,username']);

        // SEARCH (optional)
        if ($request->filled('txt_search')) {
            $search = $request->txt_search;

            $query->where(function ($q) use ($search) {
                $q->where('ip_address', 'LIKE', "%{$search}%")
                    ->orWhere('user_agent', 'LIKE', "%{$search}%")
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('full_name', 'LIKE', "%{$search}%")
                            ->orWhere('username', 'LIKE', "%{$search}%");
                    });
            });
        }

        // FILTERS
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // DATE FILTER (login_at)
        if ($request->filled('start_date')) {
            $query->whereDate('login_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('login_at', '<=', $request->end_date);
        }

        $logs = $query->latest('login_at')
            ->paginate($request->per_page ?? 15);

        $logs->getCollection()->transform(function ($log) {
            return [
                'id' => $log->id,
                'user' => $log->user ? [
                    'full_name' => $log->user->full_name ?? $log->user->username,
                    'username' => $log->user->username,
                ] : null,
                'ip_address' => $log->ip_address,
                'user_agent' => $log->user_agent,
                'login_at' => $log->login_at?->format('Y-m-d H:i:s'),
                'logout_at' => $log->logout_at?->format('Y-m-d H:i:s'),
            ];
        });

        return response()->json(['list' => $logs]);
    }

    public function stats()
    {
        $stats = [
            [
                'title' => 'Login History សរុប',
                'value' => LoginHistory::count(),
                'color' => '#6366f1',
                'icon' => 'LoginOutlined',
            ],
            [
                'title' => 'Login ថ្ងៃនេះ',
                'value' => LoginHistory::whereDate('login_at', today())->count(),
                'color' => '#06b6d4',
                'icon' => 'CalendarOutlined',
            ],
            [
                'title' => 'Active Sessions',
                'value' => LoginHistory::whereNull('logout_at')->count(),
                'color' => '#10b981',
                'icon' => 'UserOutlined',
            ],
        ];

        return response()->json(['stats' => $stats]);
    }
}
