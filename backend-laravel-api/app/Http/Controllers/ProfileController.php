<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ProfileService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Get authenticated user profile
     */
    public function profile()
    {
        return response()->json([
            'error' => false,
            'data'  => auth()->user()
        ]);
    }

    /**
     * Update profile information and password
     */
    public function update(Request $request)
    {
        $user = auth()->user();

        // Validate request data
        $request->validate([
            'full_name'        => 'required|string|max:255',
            'email'            => 'required|email|unique:users,email,' . $user->id,
            'phone'            => 'nullable|string',
            'gender'           => 'nullable|string',
            'current_password' => 'required_with:password|nullable',
            'password'         => 'nullable|min:6',
            'profile_image'    => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Verify current password before updating
        if ($request->filled('password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'error'   => true,
                    'message' => 'ពាក្យសម្ងាត់ចាស់មិនត្រឹមត្រូវទេ!'
                ], 422);
            }

            // Hash and save new password
            $user->password = bcrypt($request->password);
        }

        // Update profile fields
        $user->full_name = $request->full_name;
        $user->email     = $request->email;
        $user->phone     = $request->phone;
        $user->gender    = $request->gender;

        // Replace profile image if uploaded
        if ($request->hasFile('profile_image')) {

            // Delete old image
            if ($user->profile_image && Storage::disk('public')->exists($user->profile_image)) {
                Storage::disk('public')->delete($user->profile_image);
            }

            // Store new image
            $path = $request->file('profile_image')->store('profiles', 'public');
            $user->profile_image = $path;
        }

        $user->save();

        return response()->json([
            'error'   => false,
            'message' => 'ទិន្នន័យត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!',
            'data'    => $user
        ], 200);
    }

    /**
     * Get dashboard statistics
     */
    public function dashboardStats()
    {
        $user = auth()->user()->load(['role.permissions', 'branch']);

        // Calculate total income
        $income = DB::table('transactions')
            ->where('created_by', $user->id)
            ->sum('total_credit');

        // Calculate total expense
        $expense = DB::table('transactions')
            ->where('created_by', $user->id)
            ->sum('total_debit');

        // Current balance
        $balance = $income - $expense;

        // Count transactions
        $transactionsCount = DB::table('transactions')
            ->where('created_by', $user->id)
            ->count();

        // Get paginated audit logs
        $perPage = request()->get('per_page', 10);

        $auditLogsPaginated = DB::table('audit_logs')
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->paginate($perPage);

        // Format audit log data
        $auditLogsData = collect($auditLogsPaginated->items())->map(function ($log) {
            return [
                'action' => $log->action_type ?? '—',
                'target' => $log->table_name ?? '—',
                'time'   => $log->created_at ?? '',
            ];
        });

        return response()->json([
            // Financial summary
            'income'                => number_format($income, 2),
            'expense'               => number_format($expense, 2),
            'balance'               => number_format($balance, 2),
            'transactions'          => (string) $transactionsCount,
            'user'                  => $user,
            // Audit logs
            'audit_logs'            => $auditLogsData,
            'audit_logs_pagination' => [
                'current_page' => $auditLogsPaginated->currentPage(),
                'per_page'     => $auditLogsPaginated->perPage(),
                'total'        => $auditLogsPaginated->total(),
            ],
            // Budget overview
            'opex_percent'          => 35,
            'salary_percent'        => 65,
            // User permissions
            'permissions'           => $user->role?->permissions?->pluck('name')->values() ?? [],
        ]);
    }
}