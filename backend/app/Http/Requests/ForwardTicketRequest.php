<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\TicketStatus;

class ForwardTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasRole(['kepala_department', 'superadmin']);
    }

    public function rules(): array
    {
        return [
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'notes'         => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $ticket = $this->route('ticket');

            if ($ticket->current_status !== TicketStatus::WAITING_DEPARTMENT_APPROVAL) {
                $validator->errors()->add(
                    'current_status',
                    'Ticket hanya bisa di-forward saat menunggu approval department.'
                );
            }

            // Tidak boleh forward ke department yang sama
            if ((int) $this->department_id === (int) $ticket->department_id) {
                $validator->errors()->add(
                    'department_id',
                    'Tidak bisa forward ke department yang sama.'
                );
            }

            // Hanya approver aktif yang bisa forward
            if ((int) $ticket->current_approver_id !== (int) $this->user()->id) {
                $validator->errors()->add(
                    'current_approver_id',
                    'Anda bukan approver aktif untuk ticket ini.'
                );
            }
        });
    }

    public function messages(): array
    {   
        return [
            'department_id.required' => 'Department tujuan wajib dipilih.',
            'department_id.exists'   => 'Department tujuan tidak valid.',
        ];
    }
}