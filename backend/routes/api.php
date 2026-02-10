<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UnitApprovalController;

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {

    Route::post('/tickets', [TicketController::class, 'store']);
    Route::get('/user', fn (Request $request) => $request->user());

    Route::middleware('permission:approve_ticket')->group(function () {
        Route::post('/tickets/{ticket}/unit-approval',[UnitApprovalController::class, 'handle']
        );
    });

});



