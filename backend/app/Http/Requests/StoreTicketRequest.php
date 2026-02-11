<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\TicketCategory;
use Illuminate\Validation\Validator;

class StoreTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->can('create_ticket');
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'department_id' => 'required|exists:departments,id',
            'ticket_category_id' => 'required|exists:ticket_categories,id',
            'priority' => 'nullable|in:low,medium,high',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $category = TicketCategory::find($this->ticket_category_id);

            if (!$category) {
                return;
            }

            /**
             * CASE 1:
             * Category UMUM (department_id NULL)
             * Tidak boleh dipakai dengan department tertentu
             */
            if ($category->department_id === null && $this->department_id !== null) {
                $validator->errors()->add(
                    'ticket_category_id',
                    'Kategori umum tidak boleh dikaitkan dengan department tertentu.'
                );
            }

            /**
             * CASE 2:
             * Category khusus department
             * Harus sesuai department
             */
            if (
                $category->department_id !== null &&
                $category->department_id != $this->department_id
            ) {
                $validator->errors()->add(
                    'ticket_category_id',
                    'Kategori hanya dapat digunakan untuk department yang sesuai.'
                );
            }
        });
    }
}
