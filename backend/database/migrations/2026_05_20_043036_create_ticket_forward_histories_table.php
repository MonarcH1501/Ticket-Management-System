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
        Schema::create('ticket_forward_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')
                  ->constrained()
                  ->cascadeOnDelete();
            $table->foreignId('from_department_id')
                  ->constrained('departments');
            $table->foreignId('to_department_id')
                  ->constrained('departments');
            $table->foreignId('forwarded_by')
                  ->constrained('users');
            $table->text('notes')->nullable();
            $table->timestamp('forwarded_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_forward_histories');
    }
};
