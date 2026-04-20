<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\User;
use App\Models\TicketApproval;
use App\Enums\TicketStatus;
use App\Workflows\TicketWorkflow;
use Illuminate\Support\Facades\DB;
use LogicException;

class DepartmentApprovalService
{
    public function handle(User $approver, Ticket $ticket, array $data): Ticket
    {
        return DB::transaction(function () use ($approver, $ticket, $data) {

            // ================= VALIDATION =================
            if ($ticket->current_status !== TicketStatus::WAITING_DEPARTMENT_APPROVAL) {
                throw new LogicException(
                    'Ticket tidak berada pada tahap approval kepala department.'
                );
            }

            if ($ticket->current_approver_id !== $approver->id) {
                throw new LogicException(
                    'Anda bukan approver ticket ini.'
                );
            }

            $workflow = app(TicketWorkflow::class);

            // ================= STATUS MAP =================
            $statusMap = [
                'approve' => 'department_approved',
                'reject'  => 'department_rejected',
            ];

            // ================= CREATE APPROVAL =================
            TicketApproval::create([
                'ticket_id'   => $ticket->id,
                'approved_by' => $approver->id,
                'role_as'     => 'kepala_department',
                'status'      => $statusMap[$data['action']] ?? 'unknown',
                'notes'       => $data['notes'] ?? null,
                'approved_at' => now(),
            ]);

            if ($data['action'] === 'reject') {

                $workflow->transition($ticket, TicketStatus::REJECTED);

                $ticket->update([
                    'current_approver_id' => null
                ]);

                return $ticket;
            }

            // ================= APPROVE → ASSIGN PIC =================
            $workflow->transition($ticket, TicketStatus::WAITING_PIC_ASSIGNED);

            $ticket->update([
                'current_approver_id' => null 
            ]);

            return $ticket;
        });
    }
}
