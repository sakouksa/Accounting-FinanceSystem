<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckPermission
{
    // public function handle(Request $request, Closure $next, $permission)
    // {
    //     $user = JWTAuth::user();

    //     if (! $user) {
    //         return response()->json(['message' => 'Unauthenticated'], 401);
    //     }

    //     $permissions = $request->attributes->get('permissions', []);

    //     $hasPermission = collect($permissions)->contains('code', $permission);

    //     if (! $hasPermission) {
    //         return response()->json([
    //             'message' => 'Forbidden - No Permission',
    //         ], 403);
    //     }

    //     return $next($request);
    // }
    public function handle(Request $request, Closure $next, $permission)
    {
        $user = auth()->user(); // ទាញយក User ដែលកំពុងប្រើប្រាស់ Token

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Map controller dot notation to DB code underscore notation (e.g., branches.read -> branches_view)
        $dbPermission = str_replace('.', '_', $permission);
        $dbPermission = str_replace('_read', '_view', $dbPermission);

        // ហៅប្រើ Attribute ដែលអ្នកបានសរសេរក្នុង Model User
        // វានឹងទាញសិទ្ធិទាំងអស់មកផ្ទៀងផ្ទាត់
        if (!$user->all_permissions->contains('code', $dbPermission)) {
            return response()->json([
                'message' => 'Forbidden - No Permission',
                'required_permission' => $dbPermission
            ], 403);
        }

        return $next($request);
    }
}