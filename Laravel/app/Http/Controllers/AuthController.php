<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Mail\OtpMail;
use Illuminate\Support\Facades\Mail; // Correct Mail import from Illuminate\Support\Facades
use App\Models\PasswordResetToken;



class AuthController extends Controller
{
    // Register a new user
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Default role to 'user'
        $user->role = 'user';
        $user->save();


        return response()->json([
            'message' => 'User registered successfully',
        
        ]);
    }

// Login existing user
public function login(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    // Check if the user exists and credentials match
    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    // Generate JWT token (or any other method you're using for auth)
    $token = $user->createToken('YourAppName')->plainTextToken;

    // Return the token and role
    return response()->json([
        'message' => 'Login successful',
        'token' => $token,   // Token generated for the user
        'role' => $user->role, // Role of the user (admin/user)
    ]);
}
public function user(Request $request)
{
    return response()->json($request->user());
}

public function update(Request $request)
{
    $user = $request->user();

    $validator = Validator::make($request->all(), [
        'name' => 'sometimes|required|string|max:255',
        'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
        'password' => 'sometimes|required|string|min:8|confirmed',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    if ($request->has('name')) {
        $user->name = $request->name;
    }

    if ($request->has('email')) {
        $user->email = $request->email;
    }

    if ($request->has('password')) {
        $user->password = Hash::make($request->password);
    }

    $user->save();

    return response()->json([
        'message' => 'Profile updated successfully',
        'user' => $user,
    ]);
}

 // Delete user
 public function destroy($id)
 {
     $user = User::findOrFail($id);
     $user->delete();

     return response()->json([
         'message' => 'User deleted successfully',
     ]);
 }

 // List all users
 public function index()
 {
     $users = User::all();

     return response()->json($users);
 }

 // Show specific user
 public function show($id)
 {
     $user = User::findOrFail($id);

     return response()->json($user);
 }

 // Send OTP for password reset
 public function sendOtp(Request $request)
{
    $request->validate([
        'email' => 'required|email',
    ]);

    // Check if user exists
    $user = User::where('email', $request->email)->first();
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Generate OTP and store it in the password_reset_tokens table
    $otp = rand(100000, 999999);

    // Save OTP to the password_reset_tokens table
    PasswordResetToken::create([
        'email' => $request->email,
        'token' => $otp,
        'created_at' => now(),
    ]);

    // Send OTP to user's email (HTML formatted email)
    Mail::to($request->email)->send(new OtpMail($otp));

    return response()->json(['message' => 'OTP sent to your email.'], 200);
}


 // Verify OTP for password reset
 public function verifyOtp(Request $request)
 {
     $request->validate([
         'email' => 'required|email',
         'otp' => 'required|numeric',
     ]);

     // Check if OTP is valid
     $token = PasswordResetToken::where('email', $request->email)
                                 ->where('token', $request->otp)
                                 ->first();

     if (!$token) {
         return response()->json(['message' => 'Invalid OTP'], 400);
     }

     return response()->json(['message' => 'OTP verified'], 200);
 }

 // Reset password
 public function resetPassword(Request $request)
 {
     $request->validate([
         'email' => 'required|email',
         'password' => 'required|string|min:6|confirmed',
     ]);

     // Reset the password
     $user = User::where('email', $request->email)->first();
     if (!$user) {
         return response()->json(['message' => 'User not found'], 404);
     }

     $user->password = Hash::make($request->password);
     $user->save();

     // Delete OTP record after password reset
     PasswordResetToken::where('email', $request->email)->delete();

     return response()->json(['message' => 'Password reset successfully.'], 200);
 }

 public function getUserCount()
    {
        // Get the count of users using the User model's getUserCount method
        $userCount = User::getUserCount();

        // Return the count in JSON format
        return response()->json(['count' => $userCount]);
    }





}