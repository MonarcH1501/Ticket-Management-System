<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\TicketStatus;

class DepartmentApprovalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->can('approve_ticket');
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'in:approve,reject'],
            'notes'  => ['nullable', 'string'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $ticket = $this->route('ticket');

            if ($ticket->current_status !== TicketStatus::WAITING_DEPARTMENT_APPROVAL) {
                $validator->errors()->add(
                    'current_status',
                    'Ticket tidak berada pada tahap approval kepala department.'
                );
            }

            if (
                $ticket->current_approver_id !== null &&
                (int) $ticket->current_approver_id !== (int) $this->user()->id
            ) {
                $validator->errors()->add(
                    'current_approver_id',
                    'Anda bukan approver untuk ticket ini.'
                );
            }
        });
    }
}
