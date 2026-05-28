<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Contracts\Providers\JWT;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    // Register a new user
    public function register(Request $request)
    {
        try {

            $request->validate([
                'full_name' => 'required|string|max:255',
                'gender' => 'nullable|string',
                'phone' => 'required|string|max:20',
                'email' => 'required|email|unique:users,email',
                'username' => 'nullable|string|unique:users,username',
                'password' => 'required|string|min:6|confirmed',
                'profile_image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:5120',
            ]);

            $imagePath = null;

            if ($request->hasFile('profile_image')) {

                $imagePath = $request
                    ->file('profile_image')
                    ->store('profiles', 'public');
            }

            $user = User::create([
                'full_name' => $request->full_name,
                'gender' => $request->gender,
                'phone' => $request->phone,
                'email' => $request->email,
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'profile_image' => $imagePath,
                'status' => 1,
            ]);

            return response()->json([
                'message' => 'ចុះឈ្មោះប្រើប្រាស់បានជោគជ័យ!',
                'user' => $user
            ], 201);
        } catch (\Exception $e) {

            return response()->json([
                'error' => true,
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
            ], 500);
        }
    }
    // Login a user and return a JWT token
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Attempt to verify the credentials and create a token
        if (!$token = JWTAuth::attempt($request->only('email', 'password'))) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        // Download User and Load Profile
        $user = JWTAuth::user()->load('role');
        //Using DB Facade (Raw Query)
        $sqlpermission = "
        SELECT p.*
        FROM permissions p
        INNER JOIN role_permissions rp ON p.id = rp.permission_id
        WHERE rp.role_id = ?
    ";
        $permissions = DB::select($sqlpermission, [$user->role_id]);

        $payload = [
            "user" => $user,
            "permissions" => $permissions,
        ];
        $token = JWTAuth::claims($payload)->fromUser(JWTAuth::user()); // token payload
        return response()->json([
            'access_token' => $token,
            'user' => $user,
            'permission' => $permissions,
            'message' => 'ចូលប្រើបានជោគជ័យ!',
        ]);
    }
}