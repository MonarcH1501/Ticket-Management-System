<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ForwardTicketRequest;
use App\Services\ForwardTicketService;
use App\Models\Ticket;
use LogicException;

class ForwardTicketController extends Controller
{
    public function handle(ForwardTicketRequest $request, Ticket $ticket)
    {
        $this->authorize('forward', $ticket);

        try {
            $ticket = app(ForwardTicketService::class)
                ->handle(auth()->user(), $ticket, $request->validated());

            return response()->json([
                'message' => 'Ticket berhasil di-forward',
                'data'    => $ticket,
            ]);
        } catch (LogicException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
