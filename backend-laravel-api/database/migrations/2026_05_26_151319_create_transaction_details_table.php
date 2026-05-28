<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();

            $table->string('transaction_no', 100)->unique();

            $table->dateTime('transaction_date');

            $table->enum('transaction_type', [
                'sale',
                'purchase',
                'expense',
                'income'
            ]);

            $table->string('reference_type', 100)->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();

            $table->foreignId('branch_id')
                ->nullable()
                ->constrained('branches');

            $table->string('currency_code', 10)->default('USD');

            $table->decimal('exchange_rate', 18, 6)->default(1);

            $table->decimal('total_debit', 18, 2)->default(0);
            $table->decimal('total_credit', 18, 2)->default(0);

            $table->text('description')->nullable();

            $table->enum('status', [
                'draft',
                'posted',
                'cancelled'
            ])->default('draft');

            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users');

            $table->timestamp('approved_at')->nullable();

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};