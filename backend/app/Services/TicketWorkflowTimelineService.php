<?php

namespace App\Services;

use App\Models\Ticket;
use App\Enums\TicketStatus;


class TicketWorkflowTimelineService
{
    public function build(Ticket $ticket): array
    {
        $ticket->load([
            'approvals' => fn ($q) => $q->orderBy('approved_at'),
            'approvals.approver:id,name',
            'pic:id,name',
            'creator:id,name'
        ]);

        $steps = $this->defineSteps();

        foreach ($steps as &$step) {
            $step['status'] = $this->resolveStepStatus($ticket, $step['key']);
            $step['actor'] = $this->resolveActor($ticket, $step['key']);
            $step['completed_at'] = $this->resolveCompletedAt($ticket, $step['key']);
        }

        return [
            'ticket_id' => $ticket->id,
            'current_status' => $ticket->current_status->value,
            'steps' => $steps,
        ];
    }

    private function defineSteps(): array
    {
        return [
            ['key' => 'unit_approval', 'label' => 'Approval Kepala Unit'],
            ['key' => 'department_approval', 'label' => 'Approval Kepala Department'],
            ['key' => 'pic_work', 'label' => 'Pengerjaan oleh PIC'],
            ['key' => 'department_review', 'label' => 'Review Department'],
        ];
    }

    private function resolveStepStatus(Ticket $ticket, string $stepKey): string
    {
        return match ($stepKey) {

            'unit_approval' => match ($ticket->status) {
                TicketStatus::WAITING_UNIT_APPROVAL => 'current',
                TicketStatus::WAITING_DEPARTMENT_APPROVAL,
                TicketStatus::ASSIGNED_TO_PIC,
                TicketStatus::IN_PROGRESS,
                TicketStatus::WAITING_DEPARTMENT_REVIEW,
                TicketStatus::COMPLETED,
                TicketStatus::CLOSED => 'done',
                default => 'pending',
            },

            'department_approval' => match ($ticket->status) {
                TicketStatus::WAITING_DEPARTMENT_APPROVAL => 'current',
                TicketStatus::ASSIGNED_TO_PIC,
                TicketStatus::IN_PROGRESS,
                TicketStatus::WAITING_DEPARTMENT_REVIEW,
                TicketStatus::COMPLETED,
                TicketStatus::CLOSED => 'done',
                default => 'pending',
            },

            'pic_work' => match ($ticket->status) {
                TicketStatus::ASSIGNED_TO_PIC,
                TicketStatus::IN_PROGRESS => 'current',
                TicketStatus::WAITING_DEPARTMENT_REVIEW,
                TicketStatus::COMPLETED,
                TicketStatus::CLOSED => 'done',
                default => 'pending',
            },

            'department_review' => match ($ticket->status) {
                TicketStatus::WAITING_DEPARTMENT_REVIEW => 'current',
                TicketStatus::COMPLETED,
                TicketStatus::CLOSED => 'done',
                default => 'pending',
            },

            default => 'pending',
        };
    }

    private function resolveActor(Ticket $ticket, string $stepKey): ?string
    {
        return match ($stepKey) {
            'unit_approval' => optional(
                $ticket->approvals->firstWhere('role_as', 'kepala_unit')
            )?->approver?->name,

            'department_approval' => optional(
                $ticket->approvals->firstWhere('role_as', 'kepala_department')
            )?->approver?->name,

            'pic_work' => $ticket->pic?->name,

            'department_review' => optional(
                $ticket->approvals
                    ->where('role_as', 'kepala_department')
                    ->where('status', 'approved')
                    ->last()
            )?->approver?->name,

            default => null,
        };
    }

    private function resolveCompletedAt(Ticket $ticket, string $stepKey): ?string
    {
        return match ($stepKey) {

            'unit_approval' => optional(
                $ticket->approvals->firstWhere('role_as', 'kepala_unit')
            )?->approved_at?->toISOString(),

            'department_approval' => optional(
                $ticket->approvals->firstWhere('role_as', 'kepala_department')
            )?->approved_at?->toISOString(),

            'pic_work' => $ticket->status === TicketStatus::WAITING_DEPARTMENT_REVIEW
                || $ticket->status === TicketStatus::COMPLETED
                ? optional(
                    $ticket->approvals->firstWhere('role_as', 'pic')
                )?->approved_at?->toISOString()
                : null,

            'department_review' => optional(
                $ticket->approvals
                    ->where('role_as', 'kepala_department')
                    ->where('status', 'approved')
                    ->last()
            )?->approved_at?->toISOString(),

            default => null,
        };
    }
}