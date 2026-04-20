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
use App\Http\Controllers\Api\LookupController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AdminController;
use Spatie\Permission\Middleware\RoleMiddleware;

    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
    Route::middleware('auth:sanctum')->group(function () {

    //Route Post
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::post('/tickets/{ticket}/attachments', [TicketAttachmentController::class, 'store']);

    //Route Get
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/tickets/summary', [TicketAnalyticsController::class, 'summary']);
    Route::get('/tickets/metrics', [TicketAnalyticsController::class, 'metrics']);
    Route::get('/tickets/trends', [TicketAnalyticsController::class, 'trends']);
    Route::get('/tickets/recent', [TicketAnalyticsController::class,'recentTickets']);
    Route::get('/tickets/by-department', [TicketAnalyticsController::class,'byDepartment']);
    Route::get('/tickets/by-status', [TicketAnalyticsController::class,'byStatus']);
    Route::get('/tickets/my-tasks', [TicketAnalyticsController::class,'myTasks']);
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::get('/tickets/{ticket}', [TicketController::class, 'show']);
    Route::get('/user', fn (Request $request) => $request->user()->load('roles.permissions'));
    Route::get('/tickets/{ticket}/workflow', [TicketController::class, 'workflow']);
    Route::get('/tickets/{ticket}/attachments', [TicketAttachmentController::class, 'index']);
    Route::get('/tickets/{ticket}/attachments/{attachment}/download',[TicketAttachmentController::class, 'download']);
    Route::get('/departments', [LookupController::class,'departments']);
    Route::get('/ticket-categories', [LookupController::class,'ticketCategories']);

    //Route Delete
    Route::delete('/tickets/{ticket}/attachments/{attachment}',[TicketAttachmentController::class, 'destroy']);

    // Approval (KU & KD)
    Route::middleware('permission:approve_ticket')->group(function () {
    Route::post('/tickets/{ticket}/unit-approval', [UnitApprovalController::class, 'handle']);
    Route::post('/tickets/{ticket}/department-approval', [DepartmentApprovalController::class, 'handle']);
    Route::post('/tickets/{ticket}/department-review', [DepartmentReviewController::class, 'handle']); //setelah assign pic
    });

    // Assign PIC
    Route::middleware('permission:assign_pic')->group(function () { 
    Route::post('/tickets/{ticket}/assign-pic', [AssignPicController::class, 'handle']);
    });

    // Submit hasil kerja
    Route::middleware('permission:submit_ticket')->group(function () {
    Route::post('/tickets/{ticket}/submit', [SubmitTicketController::class, 'handle']);
    });

    // Admin routes
    Route::middleware(['role:admin|superadmin'])->group(function () {
    Route::prefix('admin')->name('admin.')->group(function () {
    // Roles
    Route::get('/roles', [AdminController::class, 'roles']);
    Route::post('/roles', [AdminController::class, 'storeRole']);
    Route::put('/roles/{role}', [AdminController::class, 'updateRole']);
    Route::delete('/roles/{role}', [AdminController::class, 'destroyRole']);
    Route::get('/roles/{role}/permissions', [AdminController::class, 'rolePermissions']);
    Route::post('/roles/{role}/permissions', [AdminController::class, 'syncRolePermissions']);

    // Permissions
    Route::get('/permissions', [AdminController::class, 'permissions']);
    Route::post('/permissions', [AdminController::class, 'storePermission']);
    Route::put('/permissions/{permission}', [AdminController::class, 'updatePermission']);
    Route::delete('/permissions/{permission}', [AdminController::class, 'destroyPermission']);

    // Users (admin full access)
    Route::get('/users', [AdminController::class, 'adminUsers']);
    Route::post('/users', [AdminController::class, 'storeUser']);
    Route::put('/users/{user}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{user}', [AdminController::class, 'destroyUser']);
    Route::post('/users/{user}/roles/{role?}', [AdminController::class, 'assignRoleToUser']);
    Route::delete('/users/{user}/roles/{role}', [AdminController::class, 'removeRoleFromUser']);
    Route::post('/users/{user}/permissions', [AdminController::class, 'syncUserPermissions']);

    //ticket Categories
    Route::get('ticket-categories', [AdminController::class, 'ticketCategories']);
    Route::post('ticket-categories', [AdminController::class, 'storeTicketCategory']);
    Route::put('ticket-categories/{ticketCategory}', [AdminController::class, 'updateTicketCategory']);
    Route::delete('ticket-categories/{ticketCategory}', [AdminController::class, 'destroyTicketCategory']);
    });
    });

    });
    






