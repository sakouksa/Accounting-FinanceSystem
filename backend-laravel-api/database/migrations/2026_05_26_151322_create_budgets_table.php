<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('budgets', function (Blueprint $table) {
            $table->id();

            $table->string('budget_name', 150);

            $table->string('fiscal_year', 20);

            $table->foreignId('account_id')
                ->constrained('chart_of_accounts');

            $table->foreignId('branch_id')
                ->nullable()
                ->constrained('branches');

            $table->decimal('allocated_amount', 18, 2)->default(0);
            $table->decimal('used_amount', 18, 2)->default(0);
            $table->decimal('remaining_amount', 18, 2)->default(0);

            $table->date('start_date');
            $table->date('end_date');

            $table->enum('status', [
                'active',
                'closed'
            ])->default('active');

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users');

            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('budgets');
    }
};