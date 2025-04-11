<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;
    protected $table = 'vehicles';

    protected $fillable = [
        'make',
        'model',
        'year',
        'price',
        'mileage',
        'condition',
        'engine_type',
        'transmission',
        'fuel_type',
        'seating_capacity',
        'description',
        'image',
        'status',
    ];

    // Relationship to Media
    public function media()
    {
        return $this->hasMany(Media::class);
    }

    public function testDrives()
    {
        return $this->hasMany(TestDrive::class);
    }

    public static function getVehicleCount()
    {
        return self::count();
    }
}
