<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Ticket;
use App\Models\TicketCategory;

class Department extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'head_id'];

    public function head()
    {
        return $this->belongsTo(User::class, 'head_id');
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function categories()
    {
        return $this->hasMany(TicketCategory::class);
    }

}
