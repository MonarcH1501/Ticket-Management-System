<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\User;
use App\Enums\TicketStatus;
use App\Models\TicketApproval;
use App\Workflows\TicketWorkflow;
use Illuminate\Support\Facades\DB;
use LogicException;

class AssignPicService
{
    public function handle(User $assigner, Ticket $ticket, int $picId): Ticket
    {
        return DB::transaction(function () use ($assigner, $ticket, $picId) {
            // memastikan status benar
            if ($ticket->current_status !== TicketStatus::ASSIGNED_TO_PIC) {
                throw new LogicException(
                    'Ticket tidak berada pada tahap assign PIC.'
                );
            }

            // 2️⃣ Ambil PIC yang valid (harus role pic & department sama)
            $pic = User::role('pic')
                ->where('department_id', $ticket->department_id)
                ->where('id', $picId)
                ->first();

            if (! $pic) {
                throw new LogicException(
                    'User bukan PIC yang valid untuk department ini.'
                );
            }

            TicketApproval::create([
                'ticket_id'   => $ticket->id,
                'approved_by' => $assigner->id,
                'role_as'     => 'kepala_department',
                'status'      => 'assigned_pic',
                'notes'       => 'PIC assigned to user ID: ' . $pic->id,
                'approved_at' => now(),
            ]);

            $workflow = app(TicketWorkflow::class);

            // 3️ Ubah status ke IN_PROGRESS
            $workflow->transition($ticket, TicketStatus::IN_PROGRESS);

            // 4️ Set PIC dan current approver
            $ticket->update([
                'pic_id' => $pic->id,
                'current_approver_id' => $pic->id
            ]);

            return $ticket;
        });
    }
}
