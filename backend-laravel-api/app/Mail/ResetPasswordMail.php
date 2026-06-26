<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ResetPasswordMail extends Mailable
{
    public string $resetLink;

    public function __construct(string $resetLink)
    {
        $this->resetLink = $resetLink;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reset Password'
        );
    }

    public function content(): Content
    {
        return new Content(
            html: $this->buildHtml()
        );
    }

    private function buildHtml(): string
    {
        return "
            <div style='font-family:Arial'>
                <h2>Reset Password</h2>

                <p>Click button below:</p>

                <a href='{$this->resetLink}'
                   style='display:inline-block;padding:10px 15px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:5px;'>
                    Reset Password
                </a>

                <p>This link expires in 60 minutes.</p>
            </div>
        ";
    }

    public function attachments(): array
    {
        return [];
    }
}
