<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehicle;
use App\Models\Media;
use Illuminate\Support\Facades\Storage;

class VehicleController extends Controller
{
    /**
     * Store a newly created vehicle in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|digits:4|min:1900|max:' . date('Y'),
            'price' => 'required|numeric|min:0',
            'mileage' => 'required|integer|min:0',
            'condition' => 'required|string|in:New,Used',
            'engine_type' => 'required|string|max:255',
            'transmission' => 'required|string|max:255',
            'fuel_type' => 'required|string|max:255',
            'seating_capacity' => 'required|integer|min:1|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'media' => 'nullable|array',
            'media.*' => 'file|mimes:jpeg,png,jpg,gif,pdf,mp4|max:20480', // Handling media files
        ]);

        // Handle file upload if image is provided
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('vehicles', 'public');
            $validated['image'] = $imagePath;
        }

        // Create the vehicle record
        $vehicle = Vehicle::create($validated);

        // Handle media files upload if provided
        if ($request->has('media')) {
            foreach ($request->file('media') as $mediaFile) {
                $mediaPath = $mediaFile->store('vehicles/media', 'public');

                Media::create([
                    'vehicle_id' => $vehicle->id,
                    'media_type' => $mediaFile->getClientMimeType(),
                    'file_path' => $mediaPath,
                ]);
            }
        }

        return response()->json([
            'message' => 'Vehicle added successfully',
            'vehicle' => $vehicle,
        ], 201);
    }

    /**
     * Display a listing of vehicles.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $vehicles = Vehicle::all();

        return response()->json($vehicles, 200);
    }

    /**
     * Display the specified vehicle.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $vehicle = Vehicle::with('media')->find($id);

        if (!$vehicle) {
            return response()->json(['message' => 'Vehicle not found'], 404);
        }

        return response()->json($vehicle, 200);
    }

    /**
     * Update the specified vehicle in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json(['message' => 'Vehicle not found'], 404);
        }

        $validated = $request->validate([
            'make' => 'sometimes|required|string|max:255',
            'model' => 'sometimes|required|string|max:255',
            'year' => 'sometimes|required|integer|digits:4|min:1900|max:' . date('Y'),
            'price' => 'sometimes|required|numeric|min:0',
            'mileage' => 'sometimes|required|integer|min:0',
            'condition' => 'sometimes|required|string|in:New,Used',
            'engine_type' => 'sometimes|required|string|max:255',
            'transmission' => 'sometimes|required|string|max:255',
            'fuel_type' => 'sometimes|required|string|max:255',
            'seating_capacity' => 'sometimes|required|integer|min:1|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'media' => 'nullable|array',
            'media.*' => 'file|mimes:jpeg,png,jpg,gif,pdf,mp4|max:20480', // Handling media files
        ]);

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('vehicles', 'public');
            $validated['image'] = $imagePath;
        }

        // Update vehicle record
        $vehicle->update($validated);

        // Handle media file uploads if provided
        if ($request->has('media')) {
            foreach ($request->file('media') as $mediaFile) {
                $mediaPath = $mediaFile->store('vehicles/media', 'public');

                Media::create([
                    'vehicle_id' => $vehicle->id,
                    'media_type' => $mediaFile->getClientMimeType(),
                    'file_path' => $mediaPath,
                ]);
            }
        }

        return response()->json(['message' => 'Vehicle updated successfully', 'vehicle' => $vehicle], 200);
    }

    /**
     * Remove the specified vehicle from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json(['message' => 'Vehicle not found'], 404);
        }

        // Delete associated media
        $vehicle->media->each(function ($media) {
            Storage::delete('public/' . $media->file_path);
            $media->delete();
        });

        // Delete vehicle
        $vehicle->delete();

        return response()->json(['message' => 'Vehicle deleted successfully'], 200);
    }

    /**
     * Upload media files for the specified vehicle.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadMedia(Request $request, $id)
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json(['message' => 'Vehicle not found'], 404);
        }

        $validated = $request->validate([
            'media' => 'nullable|array',
            'media.*' => 'file|mimes:jpeg,png,jpg,gif,pdf,mp4|max:20480', // Allowing media file types
        ]);

        // Handle media file uploads if provided
        if ($request->has('media')) {
            foreach ($request->file('media') as $mediaFile) {
                $mediaPath = $mediaFile->store('vehicles/media', 'public');

                Media::create([
                    'vehicle_id' => $vehicle->id,
                    'media_type' => $mediaFile->getClientMimeType(),
                    'file_path' => $mediaPath,
                ]);
            }
        }

        return response()->json([
            'message' => 'Media uploaded successfully!',
            'vehicle' => $vehicle,
        ], 200);
    }

    public function getVehicleCount()
    {
        // Get the count of vehicles using the Vehicle model's getVehicleCount method
        $vehicleCount = Vehicle::getVehicleCount();

        // Return the count in JSON format
        return response()->json(['count' => $vehicleCount]);
    }
    
    
}
