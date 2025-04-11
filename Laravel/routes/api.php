<?php

// routes/api.php
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestDriveController;
use App\Http\Controllers\VehicleController;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\PendingVehicleController;
use App\Models\MyVehicle;

Route::get('/test-email', function () {
    Mail::raw('This is a test email', function ($message) {
        $message->to('kavindarupasingha78@gmail.com')
                ->subject('Test Email');
    });
    return 'Test email sent!';
});

// User registration
Route::post('/register', [AuthController::class, 'register']);

// User login
Route::post('/login', [AuthController::class, 'login']);

// Get authenticated user's details (requires token)
Route::middleware('auth:api')->get('/user', [AuthController::class, 'user']);

Route::post('/vehicles', [VehicleController::class, 'store']);
Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/vehicles/{id}', [VehicleController::class, 'show']);
Route::middleware('auth:api')->post('/vehicles/{id}/purchase', [VehicleController::class, 'purchase']);
Route::put('/vehicles/{id}', [VehicleController::class, 'update']);
Route::post('vehicles/{id}/media', [VehicleController::class, 'uploadMedia']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
Route::middleware('auth:sanctum')->put('/user/update', [AuthController::class, 'update']);
Route::delete('/vehicles/{id}', [VehicleController::class, 'destroy']);

Route::get('/users', [AuthController::class, 'index']); // List all users
Route::post('/users', [AuthController::class, 'register']); // Register a user
Route::get('/users/{id}', [AuthController::class, 'show']); // Show specific user
Route::put('/users/{id}', [AuthController::class, 'update']); // Update user
Route::delete('/users/{id}', [AuthController::class, 'destroy']); // Delete user

Route::post('/test-drives', [TestDriveController::class, 'store']);
Route::middleware('auth:sanctum')->get('/test-drives', [TestDriveController::class, 'index']);
Route::middleware('auth:sanctum')->put('/test-drives/{id}', [TestDriveController::class, 'update']); 
Route::middleware('auth:sanctum')->patch('/test-drives/{id}/cancel', [TestDriveController::class, 'cancel']);
Route::middleware('auth:sanctum')->delete('/test-drives/{id}', [TestDriveController::class, 'destroy']);
Route::get('/testdrives', [TestDriveController::class, 'view']);

Route::delete('/testdrives/{id}', [TestDriveController::class, 'delete']);
Route::put('/testdrive/{id}/status', [TestDriveController::class, 'updateStatus']);



Route::post('/password-reset/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/password-reset/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/password-reset/reset-password', [AuthController::class, 'resetPassword']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/pending-vehicles', [PendingVehicleController::class, 'store']);
    Route::get('/pending-vehicles', [PendingVehicleController::class, 'index']);
    Route::post('/pending-vehicles/{id}/approve', [PendingVehicleController::class, 'approve']);
    Route::post('/pending-vehicles/{id}/reject', [PendingVehicleController::class, 'reject']);

});
Route::post('/pending-vehicles/{id}/destroy', [PendingVehicleController::class, 'destroy']);

Route::middleware('auth:sanctum')->get('/my-vehicles', function (Request $request) {
    return MyVehicle::where('user_id', $request->user()->id)->get();
});


Route::get('count1', [VehicleController::class, 'getVehicleCount']);
Route::get('count2', [AuthController::class, 'getUserCount']);