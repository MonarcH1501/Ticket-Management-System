<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Services\SubmitTicketService;
use LogicException;


class SubmitTicketController extends Controller
{
     public function handle(Ticket $ticket)
    {
        try {
            $ticket = app(SubmitTicketService::class)
                ->handle(auth()->user(), $ticket);

            return response()->json([
                'message' => 'Ticket berhasil disubmit untuk review.',
                'data' => $ticket
            ]);
        } catch (LogicException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }
}
