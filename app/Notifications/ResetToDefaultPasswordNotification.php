<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetToDefaultPasswordNotification extends Notification
{
    public function __construct(public string $token) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $url = url('/reset-password-default/' . $this->token . '?email=' . urlencode($notifiable->email));

        return (new MailMessage)
            ->subject('Konfirmasi Reset Password - SMANDING')
            ->greeting('Halo, ' . $notifiable->username . '!')
            ->line('Kami menerima permintaan reset password untuk akun Anda.')
            ->line('Klik tombol di bawah untuk mereset password ke password default.')
            ->action('Konfirmasi Reset Password', $url)
            ->line('Link ini akan kedaluwarsa dalam **60 menit**.')
            ->line('Jika Anda tidak merasa meminta reset password, abaikan email ini.')
            ->salutation('Salam, Tim SMANDING');
    }
}