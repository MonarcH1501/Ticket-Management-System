<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\TicketAttachment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TicketAttachmentStorageService
{
    public function store(
        Ticket $ticket,
        UploadedFile $file,
        int $uploadedBy,
        string $stage = 'initial'
    ): TicketAttachment {
        $disk = config('filesystems.ticket_attachment_disk', 'public');
        $path = $file->store('tickets/' . $ticket->id, $disk);

        if (!$path) {
            throw new RuntimeException('Gagal menyimpan attachment.');
        }

        return TicketAttachment::create([
            'ticket_id' => $ticket->id,
            'disk' => $disk,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'uploaded_by' => $uploadedBy,
            'stage' => $stage,
        ]);
    }

    public function download(TicketAttachment $attachment): StreamedResponse
    {
        $disk = $attachment->disk ?: 'public';

        if (!Storage::disk($disk)->exists($attachment->file_path)) {
            abort(404, 'File attachment tidak ditemukan.');
        }

        return Storage::disk($disk)->download(
            $attachment->file_path,
            $attachment->file_name
        );
    }
}
