<?php 

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Vendor;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    // Public: Get plans by vendor
    public function getByVendor($vendorId)
    {
        $vendor = Vendor::findOrFail($vendorId);

        return response()->json([
            'vendor' => $vendor,
            'plans' => $vendor->plans
        ]);
    }

    // Admin: Create plan under vendor
    public function store(Request $request)
    {
        $request->validate([
            'vendor_id' => 'required|exists:vendors,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'features' => 'nullable|array',
        ]);

        $plan = Plan::create([
            'vendor_id' => $request->vendor_id,
            'name' => $request->name,
            'price' => $request->price,
            'features' => $request->features,
        ]);

        return response()->json([
            'message' => 'Plan created successfully',
            'plan' => $plan
        ], 201);
    }

    // Admin: Update plan
    public function update(Request $request, $id)
    {
        $plan = Plan::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'features' => 'nullable|array',
        ]);

        $plan->update($request->only(['name', 'price', 'features']));

        return response()->json([
            'message' => 'Plan updated successfully',
            'plan' => $plan
        ]);
    }

    // Admin: Delete plan
    public function destroy($id)
    {
        $plan = Plan::findOrFail($id);
        $plan->delete();

        return response()->json([
            'message' => 'Plan deleted successfully'
        ]);
    }
}
