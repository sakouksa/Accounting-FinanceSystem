<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chart_of_accounts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('account_type_id')
                ->constrained('account_types');

            $table->foreignId('parent_account_id')
                ->nullable()
                ->constrained('chart_of_accounts');

            $table->string('account_code', 50)->unique();
            $table->string('account_name', 150);

            $table->integer('account_level')->default(1);

            $table->enum('normal_balance', [
                'debit',
                'credit'
            ]);

            $table->decimal('opening_balance', 18, 2)->default(0);
            $table->decimal('current_balance', 18, 2)->default(0);

            $table->string('currency_code', 10)->default('USD');

            $table->boolean('is_system')->default(false);
            $table->boolean('allow_transaction')->default(true);

            $table->text('description')->nullable();

            $table->enum('status', [
                'active',
                'inactive'
            ])->default('active');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chart_of_accounts');
    }
};