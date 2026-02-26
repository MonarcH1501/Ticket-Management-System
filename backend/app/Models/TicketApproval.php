<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketApproval extends Model
{
    use HasFactory;
    protected $fillable = [
        'ticket_id',
        'approved_by',
        'role_as',
        'status',
        'notes',
        'approved_at',
    ];

    protected $casts = [
    'approved_at' => 'datetime',
    ];

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

}
