<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Department;
use App\Models\TicketCategory;
use App\Models\Unit;
use App\Models\Position;

class LookupController extends Controller
{
    public function departments()
    {
        return Department::select('id', 'name')
            ->orderBy('name')
            ->get();
    }

    public function units()
    {
        return Unit::select('id', 'name')
            ->orderBy('name')
            ->get();
    }

    public function positions()
    {
        return Position::select('id', 'name')
            ->orderBy('name')
            ->get();
    }

    public function ticketCategories(Request $request)
    {
        $query = TicketCategory::query()
            ->select('id', 'name', 'department_id')
            ->where('is_active', 1);

        if ($request->department_id) {
            $query->where('department_id', $request->department_id);
        }

        return $query->orderBy('name')->get();
    }
}