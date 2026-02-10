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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_code')->unique();
            $table->string('title');
            $table->text('description');

            $table->foreignId('department_id')->constrained();
            $table->foreignId('ticket_category_id')->constrained();

            $table->foreignId('created_by')->constrained('users');
            $table->string('current_status');
            $table->foreignId('current_approver_id')->nullable()->constrained('users')->nullOnDelete();

            $table->string('priority')->default('medium');
            $table->date('due_date')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
