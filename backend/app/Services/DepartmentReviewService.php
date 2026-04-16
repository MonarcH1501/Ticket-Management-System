<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\User;
use App\Enums\TicketStatus;
use App\Workflows\TicketWorkflow;
use Illuminate\Support\Facades\DB;
use App\Models\TicketApproval;
use LogicException;

class DepartmentReviewService
{
    public function handle(User $reviewer, Ticket $ticket, array $data): Ticket
    {   
        return DB::transaction(function () use ($reviewer, $ticket, $data) {

            // ================= VALIDATION =================
            if ($ticket->current_status !== TicketStatus::WAITING_DEPARTMENT_REVIEW) {
                throw new LogicException(
                    'Ticket belum dalam tahap review department.'
                );
            }

            if ($ticket->department->head_id !== $reviewer->id) {
                throw new LogicException(
                    'Hanya Kepala Department yang dapat melakukan review.'
                );
            }

            $workflow = app(TicketWorkflow::class);

            // ================= APPROVAL STATUS =================
            $statusMap = [
                'approve' => 'department_approved',
                'reject'  => 'department_rejected',
            ];

            // ================= CREATE APPROVAL =================
            TicketApproval::create([
                'ticket_id'   => $ticket->id,
                'approved_by' => $reviewer->id,
                'role_as'     => 'kepala_department',
                'status'      => $statusMap[$data['action']] ?? 'unknown',
                'notes'       => $data['notes'] ?? null,
                'approved_at' => now(),
            ]);

            // ================= WORKFLOW =================
            if ($data['action'] === 'approve') {

                $workflow->transition(
                    $ticket,
                    TicketStatus::COMPLETED
                );

                $ticket->update([
                    'current_approver_id' => null,
                    'closed_at' => now()
                ]);

                return $ticket;
            }

            if ($data['action'] === 'reject') {

                $workflow->transition(
                    $ticket,
                    TicketStatus::IN_PROGRESS
                );

                $ticket->update([
                    'current_approver_id' => $ticket->pic_id
                ]);

                return $ticket;
            }

            throw new LogicException('Action tidak valid.');
        });
    }
}