<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestDrive extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'vehicle_id', 
        'test_drive_date', 
        'test_drive_time', 
        'status', 
        'note'
    ];
    public function vehicle()
{
    return $this->belongsTo(Vehicle::class);
}

public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
