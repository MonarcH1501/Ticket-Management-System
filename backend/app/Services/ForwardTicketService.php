<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\User;
use App\Models\TicketApproval;
use App\Models\TicketForwardHistory;
use App\Enums\TicketStatus;
use App\Workflows\TicketWorkflow;
use Illuminate\Support\Facades\DB;
use LogicException;

class ForwardTicketService
{
    public function handle(User $forwarder, Ticket $ticket, array $data): Ticket
    {
        return DB::transaction(function () use ($forwarder, $ticket, $data) {

            $oldDepartmentId = $ticket->department_id;
            $newDepartmentId = (int) $data['department_id'];
            $notes           = $data['notes'] ?? null;

            // ── Kepala dept tujuan wajib ada ──────────────────────────────────
            $newDeptHead = $this->getDepartmentHead($newDepartmentId);

            // ── Transition ke WAITING_DEPARTMENT_APPROVAL dept baru ───────────
            app(TicketWorkflow::class)->transition(
                $ticket,
                TicketStatus::WAITING_DEPARTMENT_APPROVAL
            );

            // ── Update ticket — hanya department & approver ───────────────────
            $ticket->update([
                'department_id'       => $newDepartmentId,
                'current_approver_id' => $newDeptHead->id,
            ]);

            // ── Catat forward history ─────────────────────────────────────────
            TicketForwardHistory::create([
                'ticket_id'          => $ticket->id,
                'from_department_id' => $oldDepartmentId,
                'to_department_id'   => $newDepartmentId,
                'forwarded_by'       => $forwarder->id,
                'notes'              => $notes,
                'forwarded_at'       => now(),
            ]);

            // ── Catat di approval history (audit trail) ───────────────────────
            TicketApproval::create([
                'ticket_id'   => $ticket->id,
                'approved_by' => $forwarder->id,
                'role_as'     => 'kepala_department',
                'status'      => 'forwarded',
                'notes'       => $notes,
                'approved_at' => now(),
            ]);

            return $ticket->fresh()->load([
                'department',
                'forwardHistories.fromDepartment:id,name',
                'forwardHistories.toDepartment:id,name',
                'forwardHistories.forwardedBy:id,name',
            ]);
        });
    }

    protected function getDepartmentHead(int $departmentId): User
    {
        $user = User::role('kepala_department')
            ->where('department_id', $departmentId)
            ->first();

        if (! $user) {
            throw new LogicException(
                'Kepala Department di department tujuan tidak ditemukan. Forward tidak dapat dilanjutkan.'
            );
        }

        return $user;
    }
}