<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    // Public: List all vendors
    public function index()
    {
        return response()->json(Vendor::all());
    }

    // Admin: Create vendor
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|url',
        ]);

        $vendor = Vendor::create($request->all());

        return response()->json([
            'message' => 'Vendor created successfully',
            'vendor' => $vendor
        ], 201);
    }

    // Admin: Update vendor
    public function update(Request $request, $id)
    {
        $vendor = Vendor::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|url',
        ]);

        $vendor->update($request->all());

        return response()->json([
            'message' => 'Vendor updated successfully',
            'vendor' => $vendor
        ]);
    }

    // Admin: Delete vendor
    public function destroy($id)
    {
        $vendor = Vendor::findOrFail($id);
        $vendor->delete();

        return response()->json([
            'message' => 'Vendor deleted successfully'
        ]);
    }

    // Public: Show single vendor
    public function show($id)
    {
        return response()->json(Vendor::findOrFail($id));
    }
}
