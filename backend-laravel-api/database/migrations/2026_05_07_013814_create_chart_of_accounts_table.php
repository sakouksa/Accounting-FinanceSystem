<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chart_of_accounts', function (Blueprint $table) {
            $table->id('account_id');
            $table->foreignId('account_type_id')->constrained('account_types', 'account_type_id');
            $table->string('account_code', 50)->unique();
            $table->string('account_name', 150);
            $table->unsignedBigInteger('parent_account_id')->nullable();
            $table->decimal('opening_balance', 12, 2)->default(0);
            $table->decimal('current_balance', 12, 2)->default(0);
            $table->string('status', 20)->default('Active');
            $table->timestamps();

            $table->foreign('parent_account_id')->references('account_id')->on('chart_of_accounts');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chart_of_accounts');
    }
};
