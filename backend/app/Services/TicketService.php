<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\User;
use App\Models\Department;
use App\Enums\TicketStatus;
use Illuminate\Support\Str;


class TicketService
{

    public function create(array $data, User $creator): Ticket
    {
        // 1. Tentukan approver awal
        $initialApprover = $this->determineInitialApprover($creator, $data['department_id']);

        // 2. Tentukan status awal
        $initialStatus = $this->determineInitialStatus($creator);

        // 3. Generate ticket code
        $ticketCode = $this->generateTicketCode();

        // 4. Create ticket
        return Ticket::create([
            'ticket_code'         => $ticketCode,
            'title'               => $data['title'],
            'description'         => $data['description'],
            'department_id'       => $data['department_id'],
            'ticket_category_id'  => $data['ticket_category_id'],
            'created_by'          => $creator->id,
            'current_status'      => $initialStatus,
            'current_approver_id' => $initialApprover?->id,
            'priority'            => $data['priority'] ?? 'medium',
        ]);
    }

    /**
     * Tentukan approver awal berdasarkan role creator
     */
    protected function determineInitialApprover(User $creator, int $departmentId): ?User
    {   

        if ($creator->hasRole('superadmin')) {
            return $creator;
        }
        // Jika creator adalah Kepala Unit
        if ($creator->hasRole('kepala_unit')) {
            return Department::find($departmentId)?->head;
        }

        // Jika creator user biasa
        if ($creator->hasRole('user')) {
            return $creator->unit?->head;
        }

        if ($creator->hasRole('kepala_department')) {
            return Department::find($departmentId)?->head;
        }

        // Default: tidak ada approver
        return null;
    }

    /**
     * Tentukan status awal ticket
     */
    protected function determineInitialStatus(User $creator): TicketStatus
    {
        if ($creator->hasRole('kepala_unit')) {
            return TicketStatus::WAITING_DEPARTMENT_APPROVAL;
        }

        return TicketStatus::WAITING_UNIT_APPROVAL;
    }

    /**
     * Generate ticket code
     */
    protected function generateTicketCode(): string
    {
        return 'TCK-' . strtoupper(Str::random(6));
    }
}
