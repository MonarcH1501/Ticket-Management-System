<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketRequest;
use App\Services\TicketService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\TicketWorkflowTimelineService;
use App\Models\Ticket;


class TicketController extends Controller
{
    public function __construct(
        protected TicketService $ticketService
    ) {} 

    private function canView($user, Ticket $ticket): bool
    {
        if ($user->hasRole('superadmin')) {
            return true;
        }

        if ($ticket->created_by === $user->id) {
            return true;
        }

        if ($ticket->pic_id === $user->id) {
            return true;
        }

        if ($ticket->current_approver_id === $user->id) {
            return true;
        }

        if ($user->hasRole('kepala_department') 
            && $user->department_id === $ticket->department_id) {
            return true;
        }

        if ($user->hasRole('kepala_unit') 
            && $user->unit_id === $ticket->creator->unit_id) {
            return true;
        }

        return false;
    }
    
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Ticket::query()
            ->with([
                'creator:id,name',
                'department:id,name',
                'pic:id,name'
            ])
            ->latest();

        // Superadmin → semua ticket
        if ($user->hasRole('superadmin')) {
            // no filter
        }

        // Kepala Department → ticket department-nya
        elseif ($user->hasRole('kepala_department')) {
            $query->where('department_id', $user->department_id);
        }

        // Kepala Unit → ticket unit-nya
        elseif ($user->hasRole('kepala_unit')) {
            $query->whereHas('creator', function ($q) use ($user) {
                $q->where('unit_id', $user->unit_id);
            });
        }

        // PIC → ticket assigned ke dia
        elseif ($user->hasRole('pic')) {
            $query->where('pic_id', $user->id);
        }

        // User biasa → ticket miliknya
        else {
            $query->where('created_by', $user->id);
        }

        return response()->json(
            $query->paginate(10)
        );
    }

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

    public function workflow(Ticket $ticket, TicketWorkflowTimelineService $service)
    {
        // $this->authorize('view', $ticket);

        return response()->json(
            $service->build($ticket)
        );
    }

    public function show(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        // Filter akses manual (tanpa policy dulu biar simpel)
        if (!$this->canView($user, $ticket)) {
            abort(403, 'Unauthorized');
        }

        $ticket->load([
            'creator:id,name,unit_id,department_id',
            'department:id,name',
            'category:id,name',
            'pic:id,name',
            'approvals' => fn ($q) => $q->orderBy('approved_at'),
            'approvals.approver:id,name'
        ]);

        return response()->json([
            'id' => $ticket->id,
            'ticket_code' => $ticket->ticket_code,
            'title' => $ticket->title,
            'description' => $ticket->description,
            'current_status' => $ticket->current_status?->value,
            'priority' => $ticket->priority,
            'due_date' => $ticket->due_date,
            'closed_at' => $ticket->closed_at,
            'creator' => $ticket->creator,
            'department' => $ticket->department,
            'category' => $ticket->category,
            'pic' => $ticket->pic,
            'approvals' => $ticket->approvals,
            'created_at' => $ticket->created_at,
        ]);
    }
}
