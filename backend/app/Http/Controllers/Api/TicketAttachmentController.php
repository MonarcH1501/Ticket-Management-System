<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Models\TicketAttachment;
use Illuminate\Support\Facades\Storage;

class TicketAttachmentController extends Controller
{
    public function store(Request $request, Ticket $ticket)
    {
        $request->validate([
            'file' => 'required|file|max:5120|mimes:pdf,jpg,jpeg,png,docx,xlsx'
        ]);

        $user = $request->user();

        // Simple access check (nanti bisa diperketat)
        if (
            $ticket->created_by !== $user->id &&
            $ticket->pic_id !== $user->id &&
            !$user->hasRole('superadmin')
        ) {
            abort(403);
        }

        $file = $request->file('file');

        $path = $file->store('tickets/'.$ticket->id, 'public');

        $attachment = TicketAttachment::create([
            'ticket_id' => $ticket->id,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'uploaded_by' => $user->id,
        ]);

        return response()->json([
            'message' => 'File uploaded successfully',
            'data' => $attachment
        ], 201);
    }

    public function index(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        // Basic access check (sama seperti detail ticket)
        if (
            !$user->hasRole('superadmin') &&
            $ticket->created_by !== $user->id &&
            $ticket->pic_id !== $user->id &&
            $ticket->department_id !== $user->department_id
        ) {
            abort(403);
        }

        $attachments = $ticket->attachments()
            ->with('uploader:id,name')
            ->latest()
            ->get();

        return response()->json($attachments);
    }

    public function destroy(Request $request, Ticket $ticket, $attachmentId)
    {
        $user = $request->user();

        $attachment = $ticket->attachments()
            ->where('id', $attachmentId)
            ->firstOrFail();

        // Hanya uploader atau superadmin
        if (
            $attachment->uploaded_by !== $user->id &&
            !$user->hasRole('superadmin')
        ) {
            abort(403);
        }

        $attachment->delete();

        return response()->json([
            'message' => 'Attachment berhasil dihapus'
        ]);
    }

    public function download(Request $request, Ticket $ticket, $attachmentId)
    {
        $attachment = $ticket->attachments()
            ->where('id', $attachmentId)
            ->firstOrFail();

        return response()->download(
            storage_path('app/public/' . $attachment->file_path),
            $attachment->file_name
        );
    }
}
