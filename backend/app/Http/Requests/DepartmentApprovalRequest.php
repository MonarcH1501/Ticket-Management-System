<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DepartmentApprovalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('approve_ticket');
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'in:approve,reject'],
            'notes'  => ['nullable', 'string'],
        ];
    }
}
