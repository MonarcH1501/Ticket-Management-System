<?php

namespace App\Enums;

enum TicketStatus: string
{
    case DRAFT = 'draft';
    case WAITING_UNIT_APPROVAL = 'waiting_unit_approval';
    case WAITING_DEPARTMENT_APPROVAL = 'waiting_department_approval';
    case WAITING_PIC_ASSIGNED = 'waiting_pic_assigned';
    case IN_PROGRESS = 'in_progress';
    case WAITING_DEPARTMENT_REVIEW = 'waiting_department_review';
    case COMPLETED = 'completed';
    case CLOSED = 'closed';
    case REJECTED = 'rejected';
}
