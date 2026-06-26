<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\LoginHistory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Register New User
     */
    public function register(Request $request)
    {
        try {
            $request->validate([
                'full_name' => 'required|string|max:255',
                'gender' => 'nullable|string|in:male,female',
                'phone' => 'required|string|max:20|unique:users,phone',
                'email' => 'required|email|unique:users,email',
                'username' => 'nullable|string|max:50|unique:users,username',
                'password' => 'required|string|min:6|confirmed',
                'profile_image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:5120',
                'address' => 'nullable|string|max:255',
                'role_id' => 'nullable|exists:roles,id',
                'branch_id' => 'nullable|exists:branches,id',
            ]);

            $imagePath = null;
            if ($request->hasFile('profile_image')) {
                $imagePath = $request->file('profile_image')->store('profiles', 'public');
            }

            $user = User::create([
                'role_id' => $request->role_id,
                'branch_id' => $request->branch_id,
                'full_name' => $request->full_name,
                'gender' => $request->gender,
                'phone' => $request->phone,
                'email' => $request->email,
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'profile_image' => $imagePath,
                'address' => $request->address,
                'status' => 1,
            ]);

            // Audit Log
            AuditLog::create([
                'user_id' => $user->id,
                'action_type' => 'create',
                'module' => 'Auth',
                'table_name' => 'users',
                'record_id' => $user->id,
                'ip_address' => $request->ip(),
                'device_info' => $request->header('User-Agent'),
                'new_value' => $user->toArray(),
            ]);

            return response()->json([
                'message' => 'ចុះឈ្មោះប្រើប្រាស់បានជោគជ័យ!',
                'user' => $user,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'error' => true,
                'message' => 'ទិន្នន័យមិនត្រឹមត្រូវ សូមពិនិត្យឡើងវិញ!',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Login User
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (! $token = JWTAuth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'error' => true,
                'message' => 'អ៊ីមែល ឬលេខសម្ងាត់មិនត្រឹមត្រូវ!',
            ], 401);
        }

        $user = JWTAuth::user()->load('role');

        $user->update([
            'last_login_at' => now(),
        ]);

        // LOGIN HISTORY
        LoginHistory::create([
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
            'login_at' => now(),
        ]);

        // Audit Log Login
        AuditLog::create([
            'user_id' => $user->id,
            'action_type' => 'login',
            'module' => 'Auth',
            'table_name' => 'users',
            'record_id' => $user->id,
            'ip_address' => $request->ip(),
            'device_info' => $request->header('User-Agent'),
            'new_value' => [
                'login_at' => now()->toDateTimeString(),
                'ip' => $request->ip(),
                'user_agent' => $request->header('User-Agent'),
            ],
        ]);

        // get Permissions
        $sqlpermission = "
        SELECT p.*
        FROM permissions p
        INNER JOIN role_permissions rp ON p.id = rp.permission_id
        WHERE rp.role_id = ?
    ";
        $permissions = DB::select($sqlpermission, [$user->role_id]);

        $payload = [
            'user' => $user,
            'permissions' => $permissions,
        ];

        // បញ្ចូល custom payload ទៅក្នុង JWT token
        $token = JWTAuth::claims($payload)->fromUser($user);

        return response()->json([
            'access_token' => $token,
            'user' => $user,
            'permissions' => $permissions,
            'message' => 'ចូលប្រើបានជោគជ័យ!',
        ]);
    }

    /**
     * Logout User
     */
    public function logout(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            // update ONLY latest login row
            $login = LoginHistory::where('user_id', $user->id)
                ->whereNull('logout_at')
                ->orderByDesc('login_at')
                ->first();

            if ($login) {
                $login->update([
                    'logout_at' => now(),
                ]);
            }

            JWTAuth::invalidate(JWTAuth::getToken());

            return response()->json([
                'message' => 'Logout success',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Logout failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}