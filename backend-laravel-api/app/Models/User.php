<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'role_id',
        'branch_id',
        'full_name',
        'gender',
        'phone',
        'email',
        'username',
        'password',
        'profile_image',
        'last_login_at',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /* =========================
       JWT IMPLEMENTATION
    ========================== */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'role_id' => $this->role_id,
            'branch_id' => $this->branch_id,
        ];
    }

    /* =========================
       RELATIONSHIPS
    ========================== */

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    // relation to payment method
    public function payments()
    {
        return $this->hasMany(Payment::class, 'recorded_by');
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'user_permissions'); // បើមាន pivot table ដោយឡែក
    }
    public function getAllPermissionsAttribute()
    {
        $rolePermissions = $this->role ? $this->role->permissions : collect();

        $userPermissions = $this->permissions;

        return $rolePermissions->merge($userPermissions)->unique('id');
    }
}