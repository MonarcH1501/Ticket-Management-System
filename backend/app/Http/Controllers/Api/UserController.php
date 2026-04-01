<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->role) {
            $query->role($request->role);
        }

        if ($request->department_id) {
            $query->where('department_id', $request->department_id);
        }

        return response()->json(
            $query->select('id', 'name')->get()
        );
    }
}
