<?php

namespace App\Http\Controllers;

use App\Models\PendingVehicle;
use App\Models\Vehicle;
use App\Models\MyVehicle; // Import the MyVehicle model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PendingVehicleController extends Controller
{
    // User submits a vehicle for approval
    public function store(Request $request)
    {
        $validated = $request->validate([
            'make' => 'required|string',
            'model' => 'required|string',
            'year' => 'required|integer',
            'price' => 'required|numeric',
            'mileage' => 'required|integer',
            'condition' => 'required|string',
            'engine_type' => 'required|string',
            'transmission' => 'required|string',
            'fuel_type' => 'required|string',
            'seating_capacity' => 'required|integer',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('vehicle_images', 'public');
        }

        $validated['user_id'] = auth()->id();
        $validated['status'] = 'Pending';

        PendingVehicle::create($validated);

        return response()->json(['message' => 'Vehicle submitted for approval'], 201);
    }

    // Admin approves a vehicle
    public function approve($id)
    {
        $pendingVehicle = PendingVehicle::findOrFail($id);

        DB::transaction(function () use ($pendingVehicle) {
            // Move data to vehicles table
            $vehicleData = $pendingVehicle->toArray();
            $vehicle = Vehicle::create($vehicleData);

            // Save to my_vehicles table with the same ID
            $myVehicleData = $vehicleData;
            $myVehicleData['id'] = $vehicle->id; // Ensure the ID matches
            $myVehicleData['status'] = 'Approved'; // Set status to 'Approved'

            MyVehicle::create($myVehicleData);

            // Delete the pending vehicle entry
            $pendingVehicle->delete();
        });

        return response()->json(['message' => 'Vehicle approved, saved to vehicles and my vehicles']);
    }

    // Admin rejects a vehicle
    public function reject($id)
    {
        $pendingVehicle = PendingVehicle::findOrFail($id);

        // Delete the pending vehicle entry
        $pendingVehicle->delete();

        return response()->json(['message' => 'Vehicle rejected and removed from pending list']);
    }

    

    // Admin views all pending vehicles
    public function index()
    {
        // Load pending vehicles and eager load the associated user data (only the user email)
        $pendingVehicles = PendingVehicle::where('status', 'Pending')
            ->with('user:id,email') // Only fetch the user's id and email
            ->get();

        return response()->json($pendingVehicles);
    }

    public function destroy($id)
    {
        // Find the vehicle by ID
        $vehicle = MyVehicle::find($id);

        if ($vehicle) {
            // Delete the vehicle
            $vehicle->delete();

            return response()->json(['message' => 'Vehicle deleted successfully.'], 200);
        }

        return response()->json(['message' => 'Vehicle not found.'], 404);
    }

    

}
