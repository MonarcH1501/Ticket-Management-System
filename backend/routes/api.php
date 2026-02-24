<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UnitApprovalController;
use App\Http\Controllers\Api\DepartmentApprovalController;
use App\Http\Controllers\Api\AssignPicController;       
use App\Http\Controllers\Api\SubmitTicketController;
use App\Http\Controllers\Api\DepartmentReviewController;

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {

    Route::post('/tickets', [TicketController::class, 'store']);
    Route::get('/user', fn (Request $request) => $request->user());

    Route::middleware('auth:sanctum')->group(function () {

    Route::post('/tickets', [TicketController::class, 'store']);
    Route::get('/user', fn (Request $request) => $request->user());

    // Approval (KU & KD)
    Route::middleware('permission:approve_ticket')->group(function () {
        Route::post('/tickets/{ticket}/unit-approval', [UnitApprovalController::class, 'handle']);
        Route::post('/tickets/{ticket}/department-approval', [DepartmentApprovalController::class, 'handle']);
        Route::post('/tickets/{ticket}/department-review',[DepartmentReviewController::class, 'handle']);
    });

    // Assign PIC (KD)
    Route::middleware('permission:assign_pic')->group(function () {
        Route::post('/tickets/{ticket}/assign-pic', [AssignPicController::class, 'handle']);
    });

    // Submit hasil kerja (PIC)
    Route::middleware('permission:submit_ticket')->group(function () {
        Route::post('/tickets/{ticket}/submit', [SubmitTicketController::class, 'handle']);
    });

});
    
    // Route::middleware('permission:approve_ticket')->group(function () {
    //     Route::post('/tickets/{ticket}/unit-approval',[UnitApprovalController::class, 'handle']);
    //     Route::post('/tickets/{ticket}/department-approval', [DepartmentApprovalController::class, 'handle']);
    //     Route::post('/tickets/{ticket}/assign-pic', [AssignPicController::class, 'handle']);
    //     Route::post('/tickets/{ticket}/submit', [SubmitTicketController::class, 'handle']);
    // });

});



