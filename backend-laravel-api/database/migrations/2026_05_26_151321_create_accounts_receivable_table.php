<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accounts_receivable', function (Blueprint $table) {
            $table->id();

            $table->foreignId('customer_id')
                ->constrained('customers');

            $table->string('invoice_no', 100)->unique();

            $table->date('invoice_date');
            $table->date('due_date');

            $table->decimal('total_amount', 18, 2)->default(0);
            $table->decimal('paid_amount', 18, 2)->default(0);
            $table->decimal('balance_amount', 18, 2)->default(0);

            $table->enum('status', [
                'unpaid',
                'partial',
                'paid'
            ])->default('unpaid');

            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accounts_receivable');
    }
};