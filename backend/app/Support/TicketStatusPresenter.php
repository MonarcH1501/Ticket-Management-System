<?php

use App\Enums\TicketStatus;


class TicketStatusPresenter
{
    public static function label(TicketStatus $status): string
    {
        return match ($status) {
            TicketStatus::DRAFT => 'Draft',
            TicketStatus::WAITING_UNIT_APPROVAL => 'Menunggu Approval Kepala Unit',
            TicketStatus::WAITING_DEPARTMENT_APPROVAL => 'Menunggu Approval Kepala Department',
            TicketStatus::ASSIGNED_TO_PIC => 'Menunggu Assign PIC',
            TicketStatus::IN_PROGRESS => 'Sedang Dikerjakan',
            TicketStatus::WAITING_DEPARTMENT_REVIEW => 'Menunggu Review Department',
            TicketStatus::COMPLETED => 'Selesai',
            TicketStatus::CLOSED => 'Ditutup',
            TicketStatus::REJECTED => 'Ditolak',
        };
    }

    public static function badge(TicketStatus $status): string
    {
        return match ($status) {
            TicketStatus::COMPLETED => 'success',
            TicketStatus::CLOSED => 'secondary',
            TicketStatus::REJECTED => 'danger',
            TicketStatus::IN_PROGRESS => 'primary',
            TicketStatus::WAITING_UNIT_APPROVAL,
            TicketStatus::WAITING_DEPARTMENT_APPROVAL,
            TicketStatus::WAITING_DEPARTMENT_REVIEW => 'warning',
            default => 'secondary',
        };
    }
}