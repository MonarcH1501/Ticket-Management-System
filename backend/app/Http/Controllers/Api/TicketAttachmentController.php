<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Services\TicketAttachmentStorageService;
use Illuminate\Http\Request;
use RuntimeException;

class TicketAttachmentController extends Controller
{
    public function __construct(
        private TicketAttachmentStorageService $attachments
    ) {}

    private function canAccessTicket($user, Ticket $ticket): bool
    {
        return
            $user->hasRole('superadmin') ||
            $ticket->created_by === $user->id ||
            $ticket->pic_id === $user->id ||
            $ticket->current_approver_id === $user->id;
    }

    public function store(Request $request, Ticket $ticket)
    {
        $request->validate([
            'file' => 'required|file|max:10240|mimes:pdf,jpg,jpeg,png,docx,xlsx',
            'stage' => 'nullable|string|in:initial,in_progress,approval,complete',
        ]);

        $user = $request->user();

        if (!$this->canAccessTicket($user, $ticket)) {
            abort(403, 'Tidak memiliki akses ke ticket ini');
        }

        try {
            $attachment = $this->attachments->store(
                $ticket,
                $request->file('file'),
                $user->id,
                $request->input('stage', 'initial')
            );
        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'message' => 'File uploaded successfully',
            'data' => $attachment,
        ], 201);
    }

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
            ->groupBy('stage');

        return response()->json($attachments);
    }

    public function destroy(Request $request, Ticket $ticket, $attachmentId)
    {
        $user = $request->user();

        if (!$this->canAccessTicket($user, $ticket)) {
            abort(403);
        }

        $attachment = $ticket->attachments()
            ->where('id', $attachmentId)
            ->firstOrFail();

        if (
            $attachment->uploaded_by !== $user->id &&
            !$user->hasRole('superadmin')
        ) {
            abort(403, 'Tidak bisa menghapus file ini');
        }

        $attachment->delete();

        return response()->json([
            'message' => 'Attachment berhasil dihapus',
        ]);
    }

    public function download(Request $request, Ticket $ticket, $attachmentId)
    {
        $user = $request->user();

        if (!$this->canAccessTicket($user, $ticket)) {
            abort(403, 'Tidak memiliki akses ke file ini');
        }

        $attachment = $ticket->attachments()
            ->where('id', $attachmentId)
            ->firstOrFail();

        return $this->attachments->download($attachment);
    }
}
