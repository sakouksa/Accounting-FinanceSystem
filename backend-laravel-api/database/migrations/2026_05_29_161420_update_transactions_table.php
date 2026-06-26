<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // (OPTIONAL) convert old data first
        DB::table('transactions')
            ->where('status', 'Pending')
            ->update(['status' => 'draft']);

        DB::table('transactions')
            ->where('status', 'Approved')
            ->update(['status' => 'posted']);

        DB::table('transactions')
            ->where('status', 'Cancelled')
            ->update(['status' => 'cancelled']);

        // alter column
        DB::statement("
            ALTER TABLE transactions
            MODIFY status ENUM('draft','posted','cancelled')
            DEFAULT 'draft'
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE transactions
            MODIFY status ENUM('Pending','Approved','Cancelled')
            DEFAULT 'Pending'
        ");
    }
};
