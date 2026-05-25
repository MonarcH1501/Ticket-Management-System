<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketNeedsApprovalNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Ticket $ticket
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/');

        return (new MailMessage)
            ->subject('Ticket Baru Membutuhkan Approval')
            ->greeting('Halo ' . $notifiable->name)
            ->line('Ada ticket baru yang membutuhkan approval Anda.')
            ->line('Kode Ticket: ' . $this->ticket->ticket_code)
            ->line('Judul: ' . $this->ticket->title)
            ->action('Lihat Ticket', $frontendUrl . '/tickets/' . $this->ticket->id)
            ->line('Silakan review ticket tersebut.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'ticket_code' => $this->ticket->ticket_code,
            'title' => $this->ticket->title,
            'message' => 'Ticket baru membutuhkan approval Anda',
            'url' => '/tickets/' . $this->ticket->id,
        ];
    }
}
