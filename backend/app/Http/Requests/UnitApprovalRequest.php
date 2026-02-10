<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\TicketStatus;

class UnitApprovalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->can('approve_ticket');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
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

            if ($ticket->current_status !== TicketStatus::WAITING_UNIT_APPROVAL->value) {
                $validator->errors()->add(
                    'current_status',
                    'Ticket tidak berada pada tahap approval kepala unit.'
                );
            }   

            if (
                $ticket->current_approver_id !== null &&
                $ticket->current_approver_id !== $this->user()->id
            ) {
                $validator->errors()->add(
                    'current_approver_id',
                    'Anda bukan approver untuk ticket ini.'
                );
            }
        });
    }

}
