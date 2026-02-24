<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\TicketStatus;
use App\Models\User;
use App\Models\Department;
use App\Models\TicketCategory;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_code',
        'title',
        'description',
        'department_id',
        'ticket_category_id',
        'created_by',
        'current_status',
        'current_approver_id',
        'pic_id',
        'priority',
        'due_date',
        'closed_at',
    ];

    protected $casts = [
        'current_status' => TicketStatus::class,
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function category()
    {
        return $this->belongsTo(TicketCategory::class, 'ticket_category_id');
    }

    public function currentApprover()
    {
        return $this->belongsTo(User::class, 'current_approver_id');
    }

    public function approvals()
    {
        return $this->hasMany(TicketApproval::class);
    }
    
    public function pic()
    {
        return $this->belongsTo(User::class, 'pic_id');
    }


}
