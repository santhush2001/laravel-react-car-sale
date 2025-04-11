<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'media_type',
        'file_path',
    ];

    // Relationship to Vehicle
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
