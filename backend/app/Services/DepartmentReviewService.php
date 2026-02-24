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

                TicketApproval::create([
                    'ticket_id'   => $ticket->id,
                    'approved_by' => $reviewer->id,
                    'role_as'     => 'kepala_department',
                    'status'      => $data['action'] === 'approve'
                                        ? 'approved'
                                        : 'rejected',
                    'notes'       => $data['notes'] ?? null,
                    'approved_at' => now(),
                ]);

            // 1️⃣ Pastikan status benar
            if ($ticket->current_status !== TicketStatus::WAITING_DEPARTMENT_REVIEW) {
                throw new LogicException(
                    'Ticket belum dalam tahap review department.'
                );
            }

            // 2️⃣ Pastikan reviewer adalah kepala department
            if ($ticket->department->head_id !== $reviewer->id) {
                throw new LogicException(
                    'Hanya Kepala Department yang dapat melakukan review.'
                );
            }

            $workflow = app(TicketWorkflow::class);

            // 3️⃣ Jika approve → COMPLETED
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

            // 4️⃣ Jika reject → balik ke PIC
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