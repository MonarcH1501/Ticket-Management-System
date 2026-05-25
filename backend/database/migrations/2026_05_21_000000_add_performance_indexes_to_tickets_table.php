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
        Schema::table('tickets', function (Blueprint $table) {
            $table->index('current_status', 'tickets_current_status_index');
            $table->index('created_at', 'tickets_created_at_index');
            $table->index('closed_at', 'tickets_closed_at_index');
            $table->index(['current_status', 'current_approver_id'], 'tickets_status_approver_index');
            $table->index(['pic_id', 'current_status'], 'tickets_pic_status_index');
            $table->index(['department_id', 'current_status'], 'tickets_department_status_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropIndex('tickets_current_status_index');
            $table->dropIndex('tickets_created_at_index');
            $table->dropIndex('tickets_closed_at_index');
            $table->dropIndex('tickets_status_approver_index');
            $table->dropIndex('tickets_pic_status_index');
            $table->dropIndex('tickets_department_status_index');
        });
    }
};
