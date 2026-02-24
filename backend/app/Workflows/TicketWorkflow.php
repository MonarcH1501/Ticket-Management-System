<?php

namespace App\Workflows;

use App\Models\Ticket;
use App\Enums\TicketStatus;
use LogicException;

class TicketWorkflow
{
    public function transition(Ticket $ticket, TicketStatus $to): void
    {
        if (! $this->canTransition($ticket->current_status, $to)) {
            throw new LogicException("Transisi tidak valid.");
        }

        $ticket->update([
            'current_status' => $to
        ]);
    }

    protected function canTransition(
        TicketStatus $from,
        TicketStatus $to
    ): bool {
        return match ($from) {

            TicketStatus::WAITING_UNIT_APPROVAL =>
                in_array($to, [
                    TicketStatus::WAITING_DEPARTMENT_APPROVAL,
                    TicketStatus::REJECTED
                ]),

            TicketStatus::WAITING_DEPARTMENT_APPROVAL =>
                in_array($to, [
                    TicketStatus::ASSIGNED_TO_PIC,
                    TicketStatus::REJECTED
                ]),

            TicketStatus::ASSIGNED_TO_PIC =>
                in_array($to, [
                    TicketStatus::IN_PROGRESS,
                ]),

            TicketStatus::IN_PROGRESS =>
                in_array($to, [
                    TicketStatus::WAITING_DEPARTMENT_REVIEW,
                ]),
            TicketStatus::WAITING_DEPARTMENT_REVIEW =>
                in_array($to, [
                    TicketStatus::COMPLETED,
                ]),

            default => false
        };
    }
}
