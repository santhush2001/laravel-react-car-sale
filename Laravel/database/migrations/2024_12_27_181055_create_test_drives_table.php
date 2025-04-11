<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTestDrivesTable extends Migration
{
    public function up()
    {
        Schema::create('test_drives', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // The user scheduling the test drive
            $table->unsignedBigInteger('vehicle_id'); // The vehicle for the test drive
            $table->date('test_drive_date');
            $table->time('test_drive_time');
            $table->string('status')->default('pending'); // Default status
            $table->text('note')->nullable(); // Optional note field
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('test_drives');
    }
}
