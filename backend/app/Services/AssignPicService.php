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
    public function handle(User $assigner, Ticket $ticket, array $data): Ticket
    {
        return DB::transaction(function () use ($assigner, $ticket, $data) {

            // ================= VALIDATION =================
            if ($ticket->current_status !== TicketStatus::WAITING_PIC_ASSIGNED) {
                throw new LogicException('Bukan tahap assign PIC');
            }

            if ($ticket->pic_id !== null) {
                throw new LogicException('PIC sudah ditentukan');
            }

            if (! $assigner->hasRole('kepala_department')) {
                throw new LogicException('Hanya Kepala Department yang bisa assign PIC');
            }

            if ($assigner->id !== $ticket->current_approver_id) {
                throw new LogicException('Anda bukan approver saat ini');
            }

            // ================= AMBIL DATA =================
            $picId = $data['pic_id'];
            $priority = $data['priority'];
            $dueDate = $data['due_date'];

            // ================= VALIDASI PIC =================
            $pic = User::role('pic')
                ->where('department_id', $ticket->department_id)
                ->where('id', $picId)
                ->first();

            if (! $pic) {
                throw new LogicException(
                    'User bukan PIC yang valid untuk department ini.'
                );
            }

            // ================= WORKFLOW =================
            $workflow = app(TicketWorkflow::class);

            // ================= LOG =================
            TicketApproval::create([
                'ticket_id'   => $ticket->id,
                'approved_by' => $assigner->id,
                'role_as'     => 'kepala_department',
                'status'      => 'pic_assigned',
                'notes'       => $data['notes'] ?? 'PIC telah ditetapkan',
                'approved_at' => now(),
            ]);

            // ================= TRANSITION =================
            $workflow->transition($ticket, TicketStatus::IN_PROGRESS);

            // ================= UPDATE =================
            $ticket->update([
                'pic_id' => $pic->id,
                'priority' => $priority,
                'due_date' => $dueDate,
                'current_approver_id' => $pic->id
            ]);

            return $ticket;
        });
    }
}