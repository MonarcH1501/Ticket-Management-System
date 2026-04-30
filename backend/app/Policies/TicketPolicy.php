<?php

namespace App\Policies;

use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('superadmin')) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Ticket $ticket): bool
    {
        if ($ticket->created_by === $user->id) {
            return true;
        }

        if ($ticket->pic_id === $user->id) {
            return true;
        }

        if ($ticket->current_approver_id === $user->id) {
            return true;
        }

        if (
            $user->hasRole('kepala_department')
            && $user->department_id === $ticket->department_id
        ) {
            return true;
        }

        if (
            $user->hasRole('kepala_unit')
            && $user->unit_id === $ticket->creator?->unit_id
        ) {
            return true;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function approveUnit(User $user, Ticket $ticket): bool
    {
        return $user->can('approve_ticket')
            && $ticket->current_status === TicketStatus::WAITING_UNIT_APPROVAL
            && $ticket->current_approver_id === $user->id;
    }

    public function approveDepartment(User $user, Ticket $ticket): bool
    {
        return $user->can('approve_ticket')
            && $ticket->current_status === TicketStatus::WAITING_DEPARTMENT_APPROVAL
            && $ticket->current_approver_id === $user->id;
    }

    public function assignPic(User $user, Ticket $ticket): bool
    {
        return $user->can('assign_pic')
            && $user->hasRole('kepala_department')
            && $ticket->current_status === TicketStatus::WAITING_PIC_ASSIGNED
            && $ticket->pic_id === null
            && $ticket->current_approver_id === $user->id;
    }

    public function submit(User $user, Ticket $ticket): bool
    {
        return $user->can('submit_ticket')
            && $ticket->current_status === TicketStatus::IN_PROGRESS
            && $ticket->pic_id === $user->id;
    }

    public function reviewDepartment(User $user, Ticket $ticket): bool
    {
        return $user->can('approve_ticket')
            && $ticket->current_status === TicketStatus::WAITING_DEPARTMENT_REVIEW
            && $ticket->department?->head_id === $user->id;
    }
}
