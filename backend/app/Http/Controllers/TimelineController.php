<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Services\TicketTimelineService;
use App\Support\TicketStatusPresenter;


class TimelineController extends Controller
{
    public function timeline(Ticket $ticket, TicketTimelineService $service)
{
    $this->authorize('view', $ticket);

    return response()->json([
        'ticket_id' => $ticket->id,
        'current_status' => $ticket->status,
        'current_status_label' => TicketStatusPresenter::label($ticket->status),
        'timeline' => $service->getTimeline($ticket),
    ]);
}
}
