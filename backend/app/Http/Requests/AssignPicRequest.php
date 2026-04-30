<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AssignPicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('assign_pic');
    }

    public function rules(): array
    {
        return [
            'pic_id'   => ['required', 'exists:users,id'],
            'priority' => ['required', 'in:low,medium,high'],
            'due_date' => ['required', 'date', 'after:today'],
            'notes'    => ['nullable', 'string'],
        ];
    }
}