<?php

namespace App\Http\Controllers\Api;

use App\Enums\TicketStatus;
use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\Request;

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

    private function summaryData($user): array
    {
        $overview = $this->baseQuery($user)
            ->selectRaw(
                'COUNT(*) as total,
                SUM(current_status = ?) as in_progress,
                SUM(current_status = ?) as completed',
                [
                    TicketStatus::IN_PROGRESS->value,
                    TicketStatus::COMPLETED->value,
                ]
            )
            ->first();

        $data = [
            'overview' => [
                'total' => (int) ($overview->total ?? 0),
                'in_progress' => (int) ($overview->in_progress ?? 0),
                'completed' => (int) ($overview->completed ?? 0),
            ],
            'my_action' => [],
        ];

        if ($user->hasRole('kepala_unit')) {
            $data['my_action']['need_my_approval'] = Ticket::where('current_status', TicketStatus::WAITING_UNIT_APPROVAL->value)
                ->where('current_approver_id', $user->id)
                ->count();
        }

        if ($user->hasRole('kepala_department')) {
            $actionCounts = Ticket::selectRaw(
                    'SUM(current_status = ?) as need_my_approval,
                    SUM(current_status = ?) as need_my_review',
                    [
                        TicketStatus::WAITING_DEPARTMENT_APPROVAL->value,
                        TicketStatus::WAITING_DEPARTMENT_REVIEW->value,
                    ]
                )
                ->where('current_approver_id', $user->id)
                ->first();

            $data['my_action']['need_my_approval'] = (int) ($actionCounts->need_my_approval ?? 0);
            $data['my_action']['need_my_review'] = (int) ($actionCounts->need_my_review ?? 0);
        }

        if ($user->hasRole('pic')) {
            $data['my_action']['assigned_to_me'] = Ticket::where('pic_id', $user->id)
                ->whereIn('current_status', [
                    TicketStatus::WAITING_PIC_ASSIGNED->value,
                    TicketStatus::IN_PROGRESS->value,
                ])
                ->count();
        }

        return $data;
    }

    private function metricsData($user): array
    {
        $query = $this->baseQuery($user);

        $avgCompletionTime = (clone $query)
            ->whereNotNull('closed_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, closed_at)) as average_hours')
            ->value('average_hours');

        return [
            'completed_today' => (clone $query)
                ->whereDate('closed_at', Carbon::today())
                ->count(),

            'completed_this_month' => (clone $query)
                ->whereMonth('closed_at', Carbon::now()->month)
                ->whereYear('closed_at', Carbon::now()->year)
                ->count(),

            'average_completion_hours' => round($avgCompletionTime ?? 0, 2),
        ];
    }

    private function trendsData($user): array
    {
        $query = $this->baseQuery($user);
        $start = now()->subDays(6)->startOfDay();
        $end = now()->endOfDay();

        $created = (clone $query)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->whereBetween('created_at', [$start, $end])
            ->groupByRaw('DATE(created_at)')
            ->pluck('total', 'date');

        $completed = (clone $query)
            ->selectRaw('DATE(closed_at) as date, COUNT(*) as total')
            ->whereBetween('closed_at', [$start, $end])
            ->groupByRaw('DATE(closed_at)')
            ->pluck('total', 'date');

        return collect(range(0, 6))
            ->map(function ($i) use ($created, $completed) {
                $date = now()->subDays(6 - $i)->toDateString();

                return [
                    'date' => $date,
                    'created' => (int) ($created[$date] ?? 0),
                    'completed' => (int) ($completed[$date] ?? 0),
                ];
            })
            ->values()
            ->all();
    }

    private function recentTicketsData($user)
    {
        return $this->baseQuery($user)
            ->latest()
            ->limit(5)
            ->get([
                'id',
                'ticket_code',
                'title',
                'current_status',
                'created_at',
            ]);
    }

    private function myTasksData($user): array
    {
        $closedStatuses = [
            TicketStatus::COMPLETED->value,
            TicketStatus::CLOSED->value,
        ];

        $relations = ['unit:id,name', 'department:id,name', 'pic:id,name'];

        $todo = Ticket::with($relations)
            ->where('current_approver_id', $user->id)
            ->whereNotIn('current_status', $closedStatuses)
            ->latest()
            ->limit(20)
            ->get();

        $inProgress = $this->baseQuery($user)
            ->with($relations)
            ->whereNotIn('current_status', $closedStatuses)
            ->where(function ($q) use ($user) {
                $q->where('pic_id', $user->id)
                    ->orWhereHas('approvals', function ($q) use ($user) {
                        $q->where('approved_by', $user->id);
                    });
            })
            ->where(function ($q) use ($user) {
                $q->whereNull('current_approver_id')
                    ->orWhere('current_approver_id', '!=', $user->id);
            })
            ->latest()
            ->limit(20)
            ->get();

        $done = $this->baseQuery($user)
            ->with($relations)
            ->whereIn('current_status', $closedStatuses)
            ->latest()
            ->limit(20)
            ->get();

        return [
            'todo' => $todo->values(),
            'in_progress' => $inProgress->values(),
            'done' => $done->values(),
        ];
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'summary' => $this->summaryData($user),
            'trends' => $this->trendsData($user),
            'recent' => $this->recentTicketsData($user),
            'my_tasks' => $this->myTasksData($user),
        ]);
    }

    public function summary(Request $request)
    {
        return response()->json($this->summaryData($request->user()));
    }

    public function metrics(Request $request)
    {
        return response()->json($this->metricsData($request->user()));
    }

    public function trends(Request $request)
    {
        return response()->json($this->trendsData($request->user()));
    }

    public function recentTickets(Request $request)
    {
        return response()->json($this->recentTicketsData($request->user()));
    }

    public function byDepartment(Request $request)
    {
        $query = $this->baseQuery($request->user());

        $data = $query
            ->selectRaw('department_id, count(*) as total')
            ->with('department:id,name')
            ->groupBy('department_id')
            ->get();

        return response()->json($data);
    }

    public function byStatus(Request $request)
    {
        $query = $this->baseQuery($request->user());

        $data = $query
            ->selectRaw('current_status, count(*) as total')
            ->groupBy('current_status')
            ->get();

        return response()->json($data);
    }

    public function myTasks(Request $request)
    {
        return response()->json($this->myTasksData($request->user()));
    }
}
