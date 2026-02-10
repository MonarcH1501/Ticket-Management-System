<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\UnitApprovalService;
use App\Models\Ticket;
use App\Http\Requests\UnitApprovalRequest;

class UnitApprovalController extends Controller
{
    public function handle(UnitApprovalRequest $request, Ticket $ticket)
    {
        $ticket = app(UnitApprovalService::class)
            ->handle(auth()->user(), $ticket, $request->validated());

        return response()->json([
            'message' => 'Approval kepala unit berhasil diproses',
            'data'    => $ticket
        ]);
    }
}


