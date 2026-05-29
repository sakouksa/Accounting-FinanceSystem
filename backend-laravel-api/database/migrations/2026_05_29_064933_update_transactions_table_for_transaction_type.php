<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add column ONLY if not exists
        if (! Schema::hasColumn('transactions', 'transaction_type_id')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->foreignId('transaction_type_id')
                    ->nullable()
                    ->after('transaction_date')
                    ->constrained('transaction_types')
                    ->nullOnDelete();
            });
        }

        // 2. Migrate old ENUM data → FK (SAFE CHECK)
        if (Schema::hasColumn('transactions', 'transaction_type')) {

            DB::table('transactions')->orderBy('id')->chunk(100, function ($rows) {
                foreach ($rows as $row) {

                    $type = DB::table('transaction_types')
                        ->where('code', $row->transaction_type)
                        ->first();

                    if ($type) {
                        DB::table('transactions')
                            ->where('id', $row->id)
                            ->update([
                                'transaction_type_id' => $type->id,
                            ]);
                    }
                }
            });

            // 3. Drop old column safely
            Schema::table('transactions', function (Blueprint $table) {
                $table->dropColumn('transaction_type');
            });
        }
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {

            // restore enum (only if not exists)
            if (! Schema::hasColumn('transactions', 'transaction_type')) {
                $table->enum('transaction_type', [
                    'sale',
                    'purchase',
                    'expense',
                    'income',
                ])->nullable();
            }

            if (Schema::hasColumn('transactions', 'transaction_type_id')) {
                $table->dropConstrainedForeignId('transaction_type_id');
            }
        });
    }
};
