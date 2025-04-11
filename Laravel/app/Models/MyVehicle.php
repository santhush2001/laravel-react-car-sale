<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MyVehicle extends Model
{
    use HasFactory;

    public $incrementing = false; // Disable auto-increment for the ID
    protected $keyType = 'int';   // Set ID to be treated as an integer

    protected $fillable = [
        'id', 'make', 'model', 'year', 'price', 'mileage', 'condition', 
        'engine_type', 'transmission', 'fuel_type', 'seating_capacity', 
        'description', 'image', 'user_id', 'status'
    ];
}
