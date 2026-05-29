```php
<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    // LIST AUDIT LOGS
    public function index(Request $req)
    {
        $query = AuditLog::with('user');

        // SEARCH
        if ($req->filled('txt_search')) {

            $search = $req->txt_search;

            $query->where(function ($q) use ($search) {

                $q->where('action_type', 'LIKE', "%{$search}%")
                    ->orWhere('module', 'LIKE', "%{$search}%")
                    ->orWhere('table_name', 'LIKE', "%{$search}%")
                    ->orWhere('ip_address', 'LIKE', "%{$search}%");
            });
        }

        // FILTER ACTION TYPE
        if ($req->filled('action_type')) {

            $query->where(
                'action_type',
                $req->action_type
            );
        }

        // FILTER MODULE
        if ($req->filled('module')) {

            $query->where(
                'module',
                $req->module
            );
        }
        // FILTER TABLE

        if ($req->filled('table_name')) {

            $query->where(
                'table_name',
                $req->table_name
            );
        }

        // FILTER USER
        if ($req->filled('user_id')) {

            $query->where(
                'user_id',
                $req->user_id
            );
        }
        // FILTER DATE RANGE
        if ($req->filled('start_date')) {

            $query->whereDate(
                'created_at',
                '>=',
                $req->start_date
            );
        }

        if ($req->filled('end_date')) {

            $query->whereDate(
                'created_at',
                '<=',
                $req->end_date
            );
        }
        // PAGINATION
        $list = $query
            ->latest()
            ->paginate(
                $req->per_page ?? 10
            );

        return response()->json([

            'list' => $list,

        ]);
    }

    // SHOW SINGLE AUDIT LOG
    public function show(string $id)
    {
        $audit = AuditLog::with('user')
            ->find($id);

        if (! $audit) {

            return response()->json([

                'error' => true,

                'message' => 'រកមិនឃើញ Audit Log',

            ], 404);
        }

        return response()->json([

            'data' => $audit,

        ]);
    }

    // AUDIT LOG STATS
    public function stats()
    {
        $stats = [

            [
                'title' => 'Audit Logs សរុប',
                'value' => AuditLog::count(),
                'color' => '#6366f1',
                'icon' => 'FileTextOutlined',
            ],

            [
                'title' => 'Create',
                'value' => AuditLog::where(
                    'action_type',
                    'create'
                )->count(),
                'color' => '#10b981',
                'icon' => 'PlusCircleOutlined',
            ],

            [
                'title' => 'Update',
                'value' => AuditLog::where(
                    'action_type',
                    'update'
                )->count(),
                'color' => '#f59e0b',
                'icon' => 'EditOutlined',
            ],

            [
                'title' => 'Delete',
                'value' => AuditLog::where(
                    'action_type',
                    'delete'
                )->count(),
                'color' => '#ef4444',
                'icon' => 'DeleteOutlined',
            ],

            [
                'title' => 'ថ្ងៃនេះ',
                'value' => AuditLog::whereDate(
                    'created_at',
                    today()
                )->count(),
                'color' => '#06b6d4',
                'icon' => 'CalendarOutlined',
            ],
        ];

        return response()->json([

            'stats' => $stats,

        ]);
    }
}
