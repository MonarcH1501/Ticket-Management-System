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

            TicketApproval::create([
                'ticket_id' => $ticket->id,
                'approved_by' => $approver->id,
                'role_as' => 'kepala_unit',
                'status' => $data['action'] === 'approve'
                    ? 'approved'
                    : 'rejected',
                'notes' => $data['notes'] ?? null,
                'approved_at' => now(),
            ]);

            $workflow = app(\App\Workflows\TicketWorkflow::class);

            if ($data['action'] === 'reject') {
                $workflow->transition($ticket, TicketStatus::REJECTED);
                $ticket->update(['current_approver_id' => null]);
                return $ticket;
            }

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
