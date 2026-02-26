<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;


class TicketAnalyticsController extends Controller
{   

    private function baseQuery($user)
    {
        $query = Ticket::query();

        if ($user->hasRole('superadmin')) {
            return $query;
        }

        if ($user->hasRole('kepala_department')) {
            return $query->where('department_id', $user->department_id);
        }

        if ($user->hasRole('kepala_unit')) {
            return $query->whereHas('creator', function ($q) use ($user) {
                $q->where('unit_id', $user->unit_id);
            });
        }

        if ($user->hasRole('pic')) {
            return $query->where('pic_id', $user->id);
        }

        return $query->where('created_by', $user->id);
    }

    public function summary(Request $request)
    {
        $user = $request->user();
        $query = $this->baseQuery($user);

        $data = [
            'overview' => [
                'total' => (clone $query)->count(),
                'in_progress' => (clone $query)
                    ->where('current_status', \App\Enums\TicketStatus::IN_PROGRESS)
                    ->count(),
                'completed' => (clone $query)
                    ->where('current_status', \App\Enums\TicketStatus::COMPLETED)
                    ->count(),
            ],
            'my_action' => [],
        ];

        // 🔥 ACTION LOGIC PER ROLE

        if ($user->hasRole('kepala_unit')) {

            $data['my_action']['need_my_approval'] = Ticket::where('current_status', \App\Enums\TicketStatus::WAITING_UNIT_APPROVAL)
                ->where('current_approver_id', $user->id)
                ->count();
        }

        if ($user->hasRole('kepala_department')) {

            $data['my_action']['need_my_approval'] = Ticket::where('current_status', \App\Enums\TicketStatus::WAITING_DEPARTMENT_APPROVAL)
                ->where('current_approver_id', $user->id)
                ->count();

            $data['my_action']['need_my_review'] = Ticket::where('current_status', \App\Enums\TicketStatus::WAITING_DEPARTMENT_REVIEW)
                ->where('current_approver_id', $user->id)
                ->count();
        }

        if ($user->hasRole('pic')) {

            $data['my_action']['assigned_to_me'] = Ticket::where('pic_id', $user->id)
                ->whereIn('current_status', [
                    \App\Enums\TicketStatus::ASSIGNED_TO_PIC,
                    \App\Enums\TicketStatus::IN_PROGRESS
                ])
                ->count();
        }

        return response()->json($data);
    }

    public function metrics(Request $request)
    {
        $query = $this->baseQuery($request->user());

        $avgCompletionTime = (clone $query)
            ->whereNotNull('closed_at')
            ->get()
            ->avg(function ($ticket) {
                return Carbon::parse($ticket->created_at)
                    ->diffInHours($ticket->closed_at);
            });

        return response()->json([
            'completed_today' => (clone $query)
                ->whereDate('closed_at', Carbon::today())
                ->count(),

            'completed_this_month' => (clone $query)
                ->whereMonth('closed_at', Carbon::now()->month)
                ->count(),

            'average_completion_hours' => round($avgCompletionTime ?? 0, 2),
        ]);
    }

    public function trends(Request $request)
    {
        $query = $this->baseQuery($request->user());

        $days = collect(range(0, 6))->map(function ($i) use ($query) {
            $date = now()->subDays($i)->toDateString();

            return [
                'date' => $date,
                'created' => (clone $query)
                    ->whereDate('created_at', $date)
                    ->count(),
                'completed' => (clone $query)
                    ->whereDate('closed_at', $date)
                    ->count(),
            ];
        })->reverse()->values();

        return response()->json($days);
    }
}
