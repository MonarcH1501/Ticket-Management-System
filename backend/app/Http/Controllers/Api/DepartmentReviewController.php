<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use App\Services\DepartmentReviewService;

class DepartmentReviewController extends Controller
{
    public function handle(
        Request $request,
        Ticket $ticket,
        DepartmentReviewService $service
    ) {
        $validated = $request->validate([
            'action' => 'required|in:approve,reject'
        ]);

        $ticket = $service->handle(
            auth()->user(),
            $ticket,
            $validated
        );

        return response()->json([
            'message' => 'Review berhasil diproses',
            'data' => $ticket
        ]);
    }
}
