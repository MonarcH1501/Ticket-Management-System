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

            // 1. Simpan histori approval
            TicketApproval::create([
                'ticket_id'   => $ticket->id,
                'approved_by' => $approver->id,
                'role_as'     => 'kepala_unit',
                'status'      => $data['action'] === 'approve'
                                    ? 'approved'
                                    : 'rejected',
                'notes'       => $data['notes'] ?? null,
                'approved_at' => now(),
            ]);

            // 2. Jika reject → workflow berhenti
            if ($data['action'] === 'reject') {
                $ticket->update([
                    'current_status'      => TicketStatus::REJECTED->value,
                    'current_approver_id' => null,
                ]);

                return $ticket;
            }

            // 3. Jika approve → lanjut ke Kepala Department
            $nextApprover = $this->getDepartmentHead($ticket);
            dd($nextApprover);
            $ticket->update([
                'current_status'      => TicketStatus::WAITING_DEPARTMENT_APPROVAL->value,
                'current_approver_id' => $nextApprover->id,
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
