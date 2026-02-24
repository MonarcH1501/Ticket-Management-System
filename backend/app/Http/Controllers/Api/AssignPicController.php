<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Services\AssignPicService;
use App\Http\Requests\AssignPicRequest;
use LogicException;

class AssignPicController extends Controller
{
    public function handle(AssignPicRequest $request, Ticket $ticket)
    {
        try {
            $ticket = app(AssignPicService::class)
                ->handle(auth()->user(), $ticket, $request->pic_id)
                ->fresh();

            return response()->json([
                'message' => 'PIC berhasil ditetapkan',
                'data' => $ticket
            ]);
        } catch (LogicException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }
}
