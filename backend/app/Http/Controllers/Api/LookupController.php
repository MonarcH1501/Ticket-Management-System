<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Department;
use App\Models\TicketCategory;

class LookupController extends Controller
{

    /**
     * Get all departments
     */
    public function departments()
    {
        return Department::select('id','name')
            ->orderBy('name')
            ->get();
    }

    /**
     * Get ticket categories
     * optionally filter by department
     */
    public function ticketCategories(Request $request)
    {
        $query = TicketCategory::query()
            ->select('id','name','department_id')
            ->where('is_active',1);

        if ($request->department_id) {
            $query->where('department_id',$request->department_id);
        }

        return $query->orderBy('name')->get();
    }

}