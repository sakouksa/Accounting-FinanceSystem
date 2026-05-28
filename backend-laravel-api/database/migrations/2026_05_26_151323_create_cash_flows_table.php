<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_flows', function (Blueprint $table) {
            $table->id();

            $table->foreignId('transaction_id')
                ->constrained('transactions')
                ->cascadeOnDelete();

            $table->dateTime('flow_date');

            $table->enum('flow_type', [
                'inflow',
                'outflow'
            ]);

            $table->foreignId('account_id')
                ->constrained('chart_of_accounts');

            $table->decimal('amount', 18, 2);

            $table->text('description')->nullable();

            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_flows');
    }
};