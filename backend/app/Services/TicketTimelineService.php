<?php

use App\Models\Ticket;
use App\Support\TicketStatusPresenter;

class TicketTimelineService
{
    public function getTimeline(Ticket $ticket): array
    {
        $ticket->load([
            'approvals' => fn ($q) => $q->orderBy('approved_at'),
            'approvals.approver:id,name',
            'user:id,name'
        ]);

        $timeline = [];

        $timeline[] = [
            'step' => 'Ticket Created',
            'actor' => $ticket->user?->name,
            'role' => 'user',
            'action' => 'created',
            'notes' => null,
            'timestamp' => $ticket->created_at,
        ];

        foreach ($ticket->approvals as $approval) {
            $timeline[] = [
                'step' => $this->resolveStepName($approval->role_as),
                'actor' => $approval->approver?->name ?? 'System',
                'role' => $approval->role_as,
                'action' => $approval->status,
                'notes' => $approval->notes,
                'timestamp' => $approval->approved_at,
            ];
        }

        return $timeline;
    }

    private function resolveStepName(string $role): string
    {
        return match ($role) {
            'kepala_unit' => 'Unit Approval',
            'kepala_department' => 'Department Approval',
            'pic' => 'PIC Handling',
            default => ucfirst($role),
        };
    }
}