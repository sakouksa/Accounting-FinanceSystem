<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckPermission
{
    public function handle(Request $request, Closure $next, $permission)
    {
        $user = JWTAuth::user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $permissions = $request->attributes->get('permissions', []);

        $hasPermission = collect($permissions)->contains('code', $permission);

        if (! $hasPermission) {
            return response()->json([
                'message' => 'Forbidden - No Permission',
            ], 403);
        }

        return $next($request);
    }
}
