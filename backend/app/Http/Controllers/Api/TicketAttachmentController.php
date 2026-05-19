<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Models\TicketAttachment;

class TicketAttachmentController extends Controller
{
   
    private function canAccessTicket($user, $ticket)
    {
        return 
            $user->hasRole('superadmin') ||

            $ticket->created_by === $user->id ||

            $ticket->pic_id === $user->id ||

            $ticket->current_approver_id === $user->id;
    }

    /**
     * 📤 Upload Attachment
     */
    // store() — terima stage dari request
    public function store(Request $request, Ticket $ticket)
    {
        $request->validate([
            'file'  => 'required|file|max:10240|mimes:pdf,jpg,jpeg,png,docx,xlsx',
            'stage' => 'nullable|string|in:initial,in_progress,approval,complete',
        ]);

        $user = $request->user();

        if (!$this->canAccessTicket($user, $ticket)) {
            abort(403, 'Tidak memiliki akses ke ticket ini');
        }

        $file = $request->file('file');
        $path = $file->store('tickets/' . $ticket->id, 'public');

        $attachment = TicketAttachment::create([
            'ticket_id'   => $ticket->id,
            'file_path'   => $path,
            'file_name'   => $file->getClientOriginalName(),
            'mime_type'   => $file->getMimeType(),
            'uploaded_by' => $user->id,
            'stage'       => $request->input('stage', 'initial'), // ← default initial
        ]);

        return response()->json([
            'message' => 'File uploaded successfully',
            'data'    => $attachment
        ], 201);
    }

    // index() — return dengan stage info
    public function index(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        if (!$this->canAccessTicket($user, $ticket)) {
            abort(403, 'Tidak memiliki akses ke attachment ini');
        }

        $attachments = $ticket->attachments()
            ->with('uploader:id,name')
            ->latest()
            ->get()
            ->groupBy('stage'); // ← grouped by stage

        return response()->json($attachments);
    }

    /**
     * Delete Attachment
     */
    public function destroy(Request $request, Ticket $ticket, $attachmentId)
    {
        $user = $request->user();

        if (!$this->canAccessTicket($user, $ticket)) {
            abort(403);
        }

        $attachment = $ticket->attachments()
            ->where('id', $attachmentId)
            ->firstOrFail();

        // hanya uploader atau superadmin
        if (
            $attachment->uploaded_by !== $user->id &&
            !$user->hasRole('superadmin')
        ) {
            abort(403, 'Tidak bisa menghapus file ini');
        }

        $attachment->delete();

        return response()->json([
            'message' => 'Attachment berhasil dihapus'
        ]);
    }

    /**
     * 📥 Download Attachment
     */
    public function download(Request $request, Ticket $ticket, $attachmentId)
    {
        $user = $request->user();

        if (!$this->canAccessTicket($user, $ticket)) {
            abort(403, 'Tidak memiliki akses ke file ini');
        }

        $attachment = $ticket->attachments()
            ->where('id', $attachmentId)
            ->firstOrFail();

        return response()->download(
            storage_path('app/public/' . $attachment->file_path),
            $attachment->file_name
        );
    }
}