<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Services\DepartmentApprovalService;
use App\Http\Requests\DepartmentApprovalRequest;
use LogicException;

class DepartmentApprovalController extends Controller
{
    public function handle(
        DepartmentApprovalRequest $request,
        Ticket $ticket
    ) {
        try {
            $ticket = app(DepartmentApprovalService::class)
                ->handle(auth()->user(), $ticket, $request->validated())
                ->fresh();

            return response()->json([
                'message' => 'Approval kepala department berhasil diproses',
                'data'    => $ticket
            ]);
        } catch (LogicException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }
}
