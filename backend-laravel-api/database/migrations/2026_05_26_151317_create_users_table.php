<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            $table->foreignId('role_id')->constrained('roles');
            $table->foreignId('branch_id')->nullable()->constrained('branches');

            $table->string('full_name', 150);
            $table->enum('gender', ['male', 'female', 'other'])->nullable();

            $table->string('phone', 30)->unique()->nullable();
            $table->string('email', 150)->unique()->nullable();
            $table->string('username', 100)->unique();

            $table->string('password');
            $table->string('profile_image')->nullable();

            $table->timestamp('last_login_at')->nullable();

            $table->enum('status', [
                'active',
                'inactive',
                'suspended'
            ])->default('active');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};