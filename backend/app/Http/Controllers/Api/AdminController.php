<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    // Roles
    public function roles(Request $request)
    {
        return response()->json(Role::with('permissions')->get());
    }

    public function storeRole(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:roles,name|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $role = Role::create($request->only('name'));

        return response()->json($role, 201);
    }

    public function updateRole(Request $request, Role $role)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string', 'max:255', Rule::unique('roles')->ignore($role->id)],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $role->update($request->only('name'));

        return response()->json($role);
    }

    public function destroyRole(Role $role)
    {
        $role->delete();
        return response()->json(['message' => 'Role deleted']);
    }

    public function rolePermissions(Request $request, Role $role)
    {
        return response()->json($role->permissions);
    }

    public function syncRolePermissions(Request $request, Role $role)
    {
        $validator = Validator::make($request->all(), [
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $role->syncPermissions($request->permissions);

        return response()->json($role->load('permissions'));
    }

    // Permissions
    public function permissions(Request $request)
    {
        return response()->json(Permission::all());
    }

    public function storePermission(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:permissions,name|max:255',
            'guard_name' => 'string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $permission = Permission::create($request->only(['name', 'guard_name']));

        return response()->json($permission, 201);
    }

    public function updatePermission(Request $request, Permission $permission)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string', 'max:255', Rule::unique('permissions')->ignore($permission->id)],
            'guard_name' => 'string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $permission->update($request->only(['name', 'guard_name']));

        return response()->json($permission);
    }

    public function destroyPermission(Permission $permission)
    {
        $permission->delete();
        return response()->json(['message' => 'Permission deleted']);
    }

    // Users (admin view)
    public function adminUsers(Request $request)
    {
        $query = User::with(['roles', 'permissions', 'unit', 'department', 'position'])
            ->select('id', 'name', 'email', 'unit_id', 'department_id', 'position_id');

        if ($request->role) {
            $query->role($request->role);
        }

        if ($request->department_id) {
            $query->where('department_id', $request->department_id);
        }

        return response()->json($query->get());
    }

    public function storeUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'unit_id' => 'nullable|exists:units,id',
            'department_id' => 'nullable|exists:departments,id',
            'position_id' => 'nullable|exists:positions,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create($request->only([
            'name', 'email', 'password', 'unit_id', 'department_id', 'position_id'
        ]));

        return response()->json($user->load(['roles', 'unit', 'department', 'position']), 201);
    }

    public function updateUser(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => ['required|email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'unit_id' => 'nullable|exists:units,id',
            'department_id' => 'nullable|exists:departments,id',
            'position_id' => 'nullable|exists:positions,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user->update($request->only([
            'name', 'email', 'unit_id', 'department_id', 'position_id'
        ]));

        if ($request->password) {
            $user->update(['password' => $request->password]);
        }

        return response()->json($user->load(['roles', 'unit', 'department', 'position']));
    }

    public function destroyUser(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }

    public function assignRoleToUser(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|string|exists:roles,name',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user->assignRole($request->role);

        return response()->json($user->load('roles'));
    }

    public function removeRoleFromUser(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'role' => 'required|string|exists:roles,name',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user->removeRole($request->role);

        return response()->json($user->load('roles'));
    }

    public function syncUserPermissions(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user->syncPermissions($request->permissions);

        return response()->json($user->load('permissions'));
    }

    public function syncUserRoles(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,name',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user->syncRoles($request->roles);

        return response()->json($user->load('roles'));
    }
}
