<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Add this import

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // Include HasApiTokens for API token generation

    // Add 'role' to the fillable array
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // Make sure 'role' is fillable
    ];

    // Hide sensitive fields
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function testDrives()
    {
        return $this->hasMany(TestDrive::class);
    }

    public static function getUserCount()
    {
        return self::count();
    }
}
