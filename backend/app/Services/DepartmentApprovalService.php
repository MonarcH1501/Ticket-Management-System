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

            // memastikan memang tahap department
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

            // 1️⃣ Simpan histori approval
            TicketApproval::create([
                'ticket_id'   => $ticket->id,
                'approved_by' => $approver->id,
                'role_as'     => 'kepala_department',
                'status'      => $data['action'] === 'approve'
                                    ? 'approved'
                                    : 'rejected',
                'notes'       => $data['notes'] ?? null,
                'approved_at' => now(),
            ]);

            $workflow = app(TicketWorkflow::class);

            // 2️⃣ Jika reject
            if ($data['action'] === 'reject') {
                $workflow->transition($ticket, TicketStatus::REJECTED);

                $ticket->update([
                    'current_approver_id' => null
                ]);

                return $ticket;
            }

            // 3️⃣ Jika approve → assign ke PIC
            $workflow->transition($ticket, TicketStatus::ASSIGNED_TO_PIC);

            // Untuk sekarang kita kosongkan dulu approver
            // nanti bisa assign otomatis PIC
            $ticket->update([
                'current_approver_id' => null
            ]);

            return $ticket;
        });
    }
}
