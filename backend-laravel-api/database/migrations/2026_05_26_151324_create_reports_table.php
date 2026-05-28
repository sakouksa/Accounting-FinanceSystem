<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();

            $table->string('report_name', 150);
            $table->string('report_type', 100);
            // balance_sheet, profit_loss, cash_flow, trial_balance

            $table->date('report_date');

            // Period control (IMPORTANT for finance)
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            // Multi-branch support
            $table->foreignId('branch_id')
                ->nullable()
                ->constrained('branches');

            // Who generated report
            $table->foreignId('generated_by')
                ->nullable()
                ->constrained('users');

            // File export
            $table->string('file_path', 255)->nullable();

            // Format tracking
            $table->enum('file_format', ['pdf', 'excel', 'html', 'csv'])
                ->nullable();
            // Status tracking
            $table->enum('status', ['draft', 'generated', 'failed'])
                ->default('generated');
            // Optional metadata (enterprise level)
            $table->json('filters')->nullable();
            // example: {"account":"1000","currency":"USD"}

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->softDeletes();

            // Index for performance
            $table->index(['report_type', 'report_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};