<?php

namespace App\Services;

use App\Models\Ticket;
use App\Enums\TicketStatus;

class TicketWorkflowTimelineService
{
    public function build(Ticket $ticket): array
    {
        $ticket->load([
            'approvals'                             => fn($q) => $q->orderBy('approved_at'),
            'approvals.approver:id,name',
            'pic:id,name',
            'creator:id,name',
            'forwardHistories'                      => fn($q) => $q->orderBy('forwarded_at'),
            'forwardHistories.fromDepartment:id,name',
            'forwardHistories.toDepartment:id,name',
            'forwardHistories.forwardedBy:id,name',
        ]);

        $steps = $this->buildSteps($ticket);

        return [
            'ticket_id'      => $ticket->id,
            'current_status' => $ticket->current_status->value,
            'steps'          => $steps,
        ];
    }

    private function buildSteps(Ticket $ticket): array
    {
        $steps = [];

        // ── 1. Unit Approval ──────────────────────────────────────────────────
        $steps[] = [
            'key'          => 'unit_approval',
            'type'         => 'approval',
            'label'        => 'Approval Kepala Unit',
            'status'       => $this->resolveUnitApprovalStatus($ticket),
            'actor'        => optional(
                                $ticket->approvals->firstWhere('role_as', 'kepala_unit')
                              )?->approver?->name,
            'completed_at' => optional(
                                $ticket->approvals->firstWhere('role_as', 'kepala_unit')
                              )?->approved_at?->toISOString(),
        ];

        // ── 2. Forward steps (dinamis, urut waktu) ────────────────────────────
        foreach ($ticket->forwardHistories as $fh) {
            $steps[] = [
                'key'          => 'forward',
                'type'         => 'forward',
                'label'        => "Forward → {$fh->toDepartment?->name}",
                'status'       => 'done',
                'actor'        => $fh->forwardedBy?->name,
                'from'         => $fh->fromDepartment?->name,
                'to'           => $fh->toDepartment?->name,
                'notes'        => $fh->notes,
                'completed_at' => $fh->forwarded_at?->toISOString(),
            ];
        }

        // ── 3. Department Approval ────────────────────────────────────────────
        $deptApproval = $ticket->approvals
            ->where('role_as', 'kepala_department')
            ->whereIn('status', ['approved', 'department_approved'])
            ->first();

        $steps[] = [
            'key'          => 'department_approval',
            'type'         => 'approval',
            'label'        => 'Approval Kepala Department',
            'status'       => $this->resolveDeptApprovalStatus($ticket),
            'actor'        => optional($deptApproval)?->approver?->name,
            'completed_at' => optional($deptApproval)?->approved_at?->toISOString(),
        ];

        // ── 4. PIC Work ───────────────────────────────────────────────────────
        $picSubmit = $ticket->approvals->firstWhere('role_as', 'pic');

        $steps[] = [
            'key'          => 'pic_work',
            'type'         => 'work',
            'label'        => 'Pengerjaan oleh PIC',
            'status'       => $this->resolvePicWorkStatus($ticket),
            'actor'        => $ticket->pic?->name,
            'completed_at' => in_array($ticket->current_status, [
                                TicketStatus::WAITING_DEPARTMENT_REVIEW,
                                TicketStatus::COMPLETED,
                              ])
                              ? optional($picSubmit)?->approved_at?->toISOString()
                              : null,
        ];

        // ── 5. Department Review ──────────────────────────────────────────────
        $deptReview = $ticket->approvals
            ->where('role_as', 'kepala_department')
            ->whereIn('status', ['approved', 'department_approved'])
            ->last();

        $steps[] = [
            'key'          => 'department_review',
            'type'         => 'approval',
            'label'        => 'Review Department',
            'status'       => $this->resolveDeptReviewStatus($ticket),
            'actor'        => optional($deptReview)?->approver?->name,
            'completed_at' => optional($deptReview)?->approved_at?->toISOString(),
        ];

        return $steps;
    }

    // ── Status resolvers ──────────────────────────────────────────────────────

    private function resolveUnitApprovalStatus(Ticket $ticket): string
    {
        return match ($ticket->current_status) {
            TicketStatus::WAITING_UNIT_APPROVAL => 'current',
            TicketStatus::WAITING_DEPARTMENT_APPROVAL,
            TicketStatus::WAITING_PIC_ASSIGNED,
            TicketStatus::IN_PROGRESS,
            TicketStatus::WAITING_DEPARTMENT_REVIEW,
            TicketStatus::COMPLETED,
            TicketStatus::CLOSED => 'done',
            default => 'pending',
        };
    }

    private function resolveDeptApprovalStatus(Ticket $ticket): string
    {
        return match ($ticket->current_status) {
            TicketStatus::WAITING_DEPARTMENT_APPROVAL => 'current',
            TicketStatus::WAITING_PIC_ASSIGNED,
            TicketStatus::IN_PROGRESS,
            TicketStatus::WAITING_DEPARTMENT_REVIEW,
            TicketStatus::COMPLETED,
            TicketStatus::CLOSED => 'done',
            default => 'pending',
        };
    }

    private function resolvePicWorkStatus(Ticket $ticket): string
    {
        return match ($ticket->current_status) {
            TicketStatus::WAITING_PIC_ASSIGNED,
            TicketStatus::IN_PROGRESS => 'current',
            TicketStatus::WAITING_DEPARTMENT_REVIEW,
            TicketStatus::COMPLETED,
            TicketStatus::CLOSED => 'done',
            default => 'pending',
        };
    }

    private function resolveDeptReviewStatus(Ticket $ticket): string
    {
        return match ($ticket->current_status) {
            TicketStatus::WAITING_DEPARTMENT_REVIEW => 'current',
            TicketStatus::COMPLETED,
            TicketStatus::CLOSED => 'done',
            default => 'pending',
        };
    }
}