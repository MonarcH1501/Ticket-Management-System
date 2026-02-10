<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketRequest;
use App\Services\TicketService;
use Illuminate\Http\JsonResponse;

class TicketController extends Controller
{
    public function __construct(
        protected TicketService $ticketService
    ) {}

    public function store(StoreTicketRequest $request): JsonResponse
    {
        $ticket = $this->ticketService->create(
            $request->validated(),
            $request->user()
        );

        return response()->json([
            'message' => 'Ticket berhasil dibuat',
            'data' => $ticket->load(['creator', 'department', 'category']),
        ], 201);
    }
}
