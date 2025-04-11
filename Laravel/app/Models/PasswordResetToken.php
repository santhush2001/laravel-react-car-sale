<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasswordResetToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'email', 'token', 'created_at'
    ];

    // Optionally, you can set the table name if it differs
    protected $table = 'password_reset_tokens';
}
