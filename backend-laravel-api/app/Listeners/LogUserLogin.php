<?php

namespace App\Listeners;

use App\Models\AuditLog;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Request;

class LogUserLogin
{
    public function handle(Login $event): void
    {
        $user = $event->user;

        AuditLog::create([
            'user_id' => $user->id,
            'action_type' => 'login',
            'module' => 'Auth',
            'table_name' => 'users',
            'record_id' => $user->id,
            'ip_address' => Request::ip(),
            'device_info' => Request::header('User-Agent'),
            'new_value' => [
                'login_at' => now()->toDateTimeString(),
                'ip' => Request::ip(),
                'user_agent' => Request::header('User-Agent'),
            ],
        ]);
    }
}
