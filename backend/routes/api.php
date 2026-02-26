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
use App\Http\Controllers\Api\TicketAttachmentController;
use App\Http\Controllers\Api\TicketAnalyticsController;


   Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {

        //Route Post
        Route::post('/tickets', [TicketController::class, 'store']);
        Route::post('/tickets/{ticket}/attachments', [TicketAttachmentController::class, 'store']);
        
        //Route Get
        Route::get('/tickets/summary', [TicketAnalyticsController::class, 'summary']);
        Route::get('/tickets/metrics', [TicketAnalyticsController::class, 'metrics']);
        Route::get('/tickets/trends', [TicketAnalyticsController::class, 'trends']);
        Route::get('/tickets', [TicketController::class, 'index']);
        Route::get('/tickets/{ticket}', [TicketController::class, 'show']);
        Route::get('/user', fn (Request $request) => $request->user());
        Route::get('/tickets/{ticket}/workflow', [TicketController::class, 'workflow']);
        Route::get('/tickets/{ticket}/attachments', [TicketAttachmentController::class, 'index']);
        Route::get('/tickets/{ticket}/attachments/{attachment}/download',[TicketAttachmentController::class, 'download']);

        //Route Delete
        Route::delete('/tickets/{ticket}/attachments/{attachment}',[TicketAttachmentController::class, 'destroy']);

        // Approval (KU & KD)
        Route::middleware('permission:approve_ticket')->group(function () {
            Route::post('/tickets/{ticket}/unit-approval', [UnitApprovalController::class, 'handle']);
            Route::post('/tickets/{ticket}/department-approval', [DepartmentApprovalController::class, 'handle']);
            Route::post('/tickets/{ticket}/department-review', [DepartmentReviewController::class, 'handle']);
        });

        // Assign PIC
        Route::middleware('permission:assign_pic')->group(function () {
            Route::post('/tickets/{ticket}/assign-pic', [AssignPicController::class, 'handle']);
        });

        // Submit hasil kerja
        Route::middleware('permission:submit_ticket')->group(function () {
            Route::post('/tickets/{ticket}/submit', [SubmitTicketController::class, 'handle']);
        });

    });
        





