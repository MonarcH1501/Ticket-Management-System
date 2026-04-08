<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\User;
use App\Models\TicketApproval;
use App\Models\TicketAttachment;
use App\Enums\TicketStatus;
use App\Workflows\TicketWorkflow;
use Illuminate\Support\Facades\DB;
use LogicException;

class SubmitTicketService
{
    public function handle(User $user, Ticket $ticket, $file = null): Ticket
    {
        return DB::transaction(function () use ($user, $ticket, $file) {

            // ================= VALIDATION =================
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

            // ================= UPLOAD FILE =================
            if ($file) {
                $path = $file->store('tickets/' . $ticket->id, 'public');

                TicketAttachment::create([
                    'ticket_id'   => $ticket->id,
                    'file_path'   => $path,
                    'file_name'   => $file->getClientOriginalName(),
                    'mime_type'   => $file->getMimeType(),
                    'uploaded_by' => $user->id,
                ]);
            }

            // ================= APPROVAL LOG =================
            TicketApproval::create([
                'ticket_id'   => $ticket->id,
                'approved_by' => $user->id,
                'role_as'     => 'pic',
                'status'      => 'submitted',
                'notes'       => null,
                'approved_at' => now(),
            ]);

            // ================= WORKFLOW =================
            $workflow = app(TicketWorkflow::class);

            $workflow->transition(
                $ticket,
                TicketStatus::WAITING_DEPARTMENT_REVIEW
            );

            // ================= SET APPROVER =================
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