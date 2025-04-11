<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('my_vehicles', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary(); // Match with vehicles table
            $table->string('make');
            $table->string('model');
            $table->integer('year');
            $table->decimal('price', 10, 2);
            $table->integer('mileage');
            $table->string('condition');
            $table->string('engine_type');
            $table->string('transmission');
            $table->string('fuel_type');
            $table->integer('seating_capacity');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('status')->default('Approved');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('my_vehicles');
    }
};
