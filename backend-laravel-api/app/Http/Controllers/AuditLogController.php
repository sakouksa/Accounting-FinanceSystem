<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class AuditLogController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:audit_logs.read', only: ['index', 'stats']),
        ];
    }

    public function index(Request $request)
    {
        $query = AuditLog::with(['user' => function ($q) {
            $q->select('id', 'full_name', 'username');
        }]);

        // SEARCH
        if ($request->filled('txt_search')) {
            $search = $request->txt_search;

            $query->where(function ($q) use ($search) {
                $q->where('action_type', 'LIKE', "%{$search}%")
                    ->orWhere('module', 'LIKE', "%{$search}%")
                    ->orWhere('table_name', 'LIKE', "%{$search}%")
                    ->orWhere('ip_address', 'LIKE', "%{$search}%")
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('full_name', 'LIKE', "%{$search}%")
                            ->orWhere('username', 'LIKE', "%{$search}%");
                    });
            });
        }

        // FILTERS
        if ($request->filled('action_type')) {
            $query->where('action_type', $request->action_type);
        }

        if ($request->filled('module')) {
            $query->where('module', $request->module);
        }

        if ($request->filled('table_name')) {
            $query->where('table_name', $request->table_name);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // DATE FILTER
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $logs = $query->latest()->paginate($request->per_page ?? 15);

        $logs->getCollection()->transform(function ($log) {
            return [
                'id' => $log->id,
                'user' => $log->user ? [
                    'full_name' => $log->user->full_name ?? $log->user->username,
                    'username' => $log->user->username,
                ] : null,
                'action_type' => $log->action_type,
                'module' => $log->module,
                'table_name' => $log->table_name,
                'record_id' => $log->record_id,
                'ip_address' => $log->ip_address,
                'device_info' => $log->device_info,
                'created_at' => $log->created_at?->format('Y-m-d H:i:s'),
            ];
        });

        return response()->json(['list' => $logs]);
    }

    public function stats()
    {
        $stats = [
            ['title' => 'Audit Logs សរុប', 'value' => AuditLog::count(), 'color' => '#6366f1', 'icon' => 'FileTextOutlined'],
            ['title' => 'Login', 'value' => AuditLog::where('action_type', 'login')->count(), 'color' => '#3b82f6', 'icon' => 'LoginOutlined'],
            ['title' => 'Create', 'value' => AuditLog::where('action_type', 'create')->count(), 'color' => '#10b981', 'icon' => 'PlusCircleOutlined'],
            ['title' => 'ថ្ងៃនេះ', 'value' => AuditLog::whereDate('created_at', today())->count(), 'color' => '#06b6d4', 'icon' => 'CalendarOutlined'],
        ];

        return response()->json(['stats' => $stats]);
    }
}
