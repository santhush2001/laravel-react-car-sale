<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TestDrive;

class TestDriveController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'vehicle_id' => 'required|exists:vehicles,id',
            'test_drive_date' => 'required|date',
            'test_drive_time' => 'required',
            'note' => 'nullable|string',
        ]);

        // Add default status
        $validated['status'] = 'pending';

        // Save test drive
        $testDrive = TestDrive::create($validated);

        return response()->json([
            'message' => 'Test drive scheduled successfully!',
            'testDrive' => $testDrive
        ], 201);
    }

    public function index(Request $request)
    {
        $user = $request->user();

        // Fetch test drives for the authenticated user
        $testDrives = TestDrive::with('vehicle') // Assuming you have a vehicle relationship
            ->where('user_id', $user->id)
            ->get();

        return response()->json($testDrives, 200);
    }

    // Update Test Drive Appointment (Edit)
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'test_drive_date' => 'nullable|date',
            'test_drive_time' => 'nullable',
            'note' => 'nullable|string',
        ]);

        $testDrive = TestDrive::find($id);

        if (!$testDrive) {
            return response()->json(['message' => 'Test drive not found.'], 404);
        }

        // Update the test drive fields
        $testDrive->update($validated);

        return response()->json([
            'message' => 'Test drive updated successfully!',
            'testDrive' => $testDrive
        ], 200);
    }

    // Cancel Test Drive Appointment
    public function cancel($id)
    {
        $testDrive = TestDrive::find($id);

        if (!$testDrive) {
            return response()->json(['message' => 'Test drive not found.'], 404);
        }

        // Update the status to 'cancelled'
        $testDrive->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Test drive cancelled successfully!',
            'testDrive' => $testDrive
        ], 200);
    }

    // Delete Test Drive Appointment
    public function destroy($id)
    {
        $testDrive = TestDrive::find($id);

        if (!$testDrive) {
            return response()->json(['message' => 'Test drive not found.'], 404);
        }

        // Delete the test drive
        $testDrive->delete();

        return response()->json([
            'message' => 'Test drive deleted successfully!'
        ], 200);
    }

    public function view(){
        $appointments = TestDrive::all();
        return response()->json($appointments);
    }

    public function delete($id)
{
    try {
        $testDrive = TestDrive::findOrFail($id); // Check if the record exists
        $testDrive->delete(); // Delete the record

        return response()->json([
            'message' => 'Appointment deleted successfully',
        ], 200); // HTTP 200 OK
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        // Handle the case where the record is not found
        return response()->json([
            'message' => 'Appointment not found',
        ], 404); // HTTP 404 Not Found
    } catch (\Exception $e) {
        // Handle any other unexpected exceptions
        return response()->json([
            'message' => 'An error occurred while deleting the appointment',
            'error' => $e->getMessage(),
        ], 500); // HTTP 500 Internal Server Error
    }

    
}

public function updateStatus(Request $request, $id)
    {
        // Validate the incoming request to ensure the status is either 'approved' or 'canceled'
        $validatedData = $request->validate([
            'status' => 'required|string|in:approved,canceled',  // Only approved or canceled status
        ]);

        // Find the test drive by id
        $testDrive = TestDrive::find($id);

        if (!$testDrive) {
            return response()->json(['message' => 'Test drive not found'], 404);
        }

        // Update the status of the test drive
        $testDrive->status = $validatedData['status'];

        // Save the updated status
        $testDrive->save();

        // Return a response with the updated test drive data
        return response()->json([
            'message' => 'Test drive status updated successfully',
            'data' => $testDrive
        ]);
    }

}
