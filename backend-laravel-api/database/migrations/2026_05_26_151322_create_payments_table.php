<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->string('payment_no', 100)->unique();

            $table->enum('payment_type', [
                'payable',
                'receivable'
            ]);

            $table->foreignId('payable_id')
                ->nullable()
                ->constrained('accounts_payable');

            $table->foreignId('receivable_id')
                ->nullable()
                ->constrained('accounts_receivable');

            $table->dateTime('payment_date');

            $table->enum('payment_method', [
                'cash',
                'bank',
                'qr',
                'card'
            ]);

            $table->string('currency_code', 10)->default('USD');

            $table->decimal('exchange_rate', 18, 6)->default(1);

            $table->decimal('amount', 18, 2);

            $table->string('reference_no', 100)->nullable();

            $table->foreignId('transaction_id')
                ->nullable()
                ->constrained('transactions');

            $table->enum('status', [
                'pending',
                'completed',
                'cancelled'
            ])->default('pending');

            $table->foreignId('recorded_by')
                ->nullable()
                ->constrained('users');

            $table->text('remarks')->nullable();

            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};