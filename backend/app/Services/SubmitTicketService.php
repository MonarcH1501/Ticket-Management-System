<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\User;
use App\Enums\TicketStatus;
use App\Workflows\TicketWorkflow;
use Illuminate\Support\Facades\DB;
use App\Models\TicketApproval;

use LogicException;

class SubmitTicketService
{
    public function handle(User $user, Ticket $ticket): Ticket
    {
        return DB::transaction(function () use ($user, $ticket) {

            TicketApproval::create([
                'ticket_id'   => $ticket->id,
                'approved_by' => $user->id,
                'role_as'     => 'pic',
                'status'      => 'submitted',
                'notes'       => null, 
                'approved_at' => now(),
            ]);

            if ($ticket->current_status !== TicketStatus::IN_PROGRESS) {
                throw new LogicException(
                    'Ticket belum dalam tahap pengerjaan.'
                );
            }

            if ($ticket->pic_id !== $user->id) {
                throw new LogicException(
                    'Hanya PIC yang dapat submit hasil kerja.'
                );
            }

            $workflow = app(TicketWorkflow::class);

            // 3️⃣ Ubah status ke WAITING_DEPARTMENT_REVIEW
            $workflow->transition(
                $ticket,
                TicketStatus::WAITING_DEPARTMENT_REVIEW
            );

            // 4️⃣ Set approver ke Kepala Department
            $departmentHead = User::find($ticket->department->head_id);

            if (! $departmentHead) {
                throw new LogicException('Kepala Department tidak ditemukan.');
            }

            $ticket->update([
                'current_approver_id' => $departmentHead->id,
            ]);

            return $ticket->refresh();
        });
    }
}