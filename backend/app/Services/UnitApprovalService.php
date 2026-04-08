<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\User;
use App\Models\TicketApproval;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Enums\TicketStatus;
use LogicException;

class UnitApprovalService
{
    public function handle(User $approver, Ticket $ticket, array $data): Ticket
    {
        return DB::transaction(function () use ($approver, $ticket, $data) {

            // ================= VALIDATION =================
            if ($ticket->current_status !== TicketStatus::WAITING_UNIT_APPROVAL) {
                throw new LogicException(
                    'Ticket tidak berada pada tahap approval unit.'
                );
            }

            if ($ticket->current_approver_id !== $approver->id) {
                throw new LogicException(
                    'Anda bukan approver ticket ini.'
                );
            }

            $workflow = app(\App\Workflows\TicketWorkflow::class);

            // ================= STATUS MAP =================
            $statusMap = [
                'approve' => 'unit_approved',
                'reject'  => 'unit_rejected',
            ];

            // ================= CREATE APPROVAL =================
            TicketApproval::create([
                'ticket_id'   => $ticket->id,
                'approved_by' => $approver->id,
                'role_as'     => 'kepala_unit',
                'status'      => $statusMap[$data['action']] ?? 'unknown',
                'notes'       => $data['notes'] ?? null,
                'approved_at' => now(),
            ]);

            // ================= REJECT =================
            if ($data['action'] === 'reject') {
                $workflow->transition($ticket, TicketStatus::REJECTED);

                $ticket->update([
                    'current_approver_id' => null
                ]);

                return $ticket;
            }

            // ================= APPROVE → NEXT =================
            $nextApprover = $this->getDepartmentHead($ticket);

            $workflow->transition(
                $ticket,
                TicketStatus::WAITING_DEPARTMENT_APPROVAL
            );

            $ticket->update([
                'current_approver_id' => $nextApprover->id
            ]);

            return $ticket;
        });
    }


    protected function getDepartmentHead(Ticket $ticket): User
    {
        $user = User::role('kepala_department')
            ->where('department_id', $ticket->department_id)
            ->first();

        if (! $user) {
            throw new LogicException(
                'Kepala Department tidak ditemukan.'
            );
        }

        return $user;
    }
}
