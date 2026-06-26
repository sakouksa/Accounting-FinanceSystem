<?php

namespace App\Listeners;

use App\Models\AuditLog;
use GuzzleHttp\Psr7\Request;
use Illuminate\Auth\Events\Logout;

class LogUserLogout
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Logout $event): void
    {
        $user = $event->user;
        if (! $user) {
            return;
        }

        AuditLog::create([
            'user_id' => $user->id,
            'action_type' => 'logout',
            'module' => 'Auth',
            'table_name' => 'users',
            'record_id' => $user->id,
            'ip_address' => Request::ip(),
            'device_info' => Request::header('User-Agent'),
            'new_value' => ['logout_at' => now()->toDateTimeString()],
        ]);
    }
}
