<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('financial_reports', function (Blueprint $table) {
            $table->id();

            $table->enum('report_type', [
                'balance_sheet',
                'profit_loss',
                'cash_flow'
            ]);

            $table->foreignId('branch_id')
                ->nullable()
                ->constrained('branches');

            $table->date('start_date');
            $table->date('end_date');

            $table->foreignId('generated_by')
                ->nullable()
                ->constrained('users');

            $table->string('file_path', 255)->nullable();

            $table->timestamp('generated_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financial_reports');
    }
};