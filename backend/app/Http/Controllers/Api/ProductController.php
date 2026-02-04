<?php 
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Subscription;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Get products based on user subscription (premium filter)
    public function index(Request $request)
    {
        $user = $request->user();

        // Check if user has any active PREMIUM plan
        $hasPremium = Subscription::where('user_id', $user->id)
            ->where('status', 'active')
            ->whereHas('plan', function ($q) {
                $q->where('name', 'LIKE', '%Premium%');
            })
            ->exists();

        if ($hasPremium) {
            // Premium user → see all products
            $products = Product::all();
        } else {
            // Non-premium user → only non-premium products
            $products = Product::where('is_premium', false)->get();
        }

        return response()->json([
            'is_premium_user' => $hasPremium,
            'products' => $products
        ]);
    }

    // Admin: create product
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_premium' => 'required|boolean',
        ]);

        $product = Product::create($request->all());

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }

    // Admin: update product
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'is_premium' => 'sometimes|required|boolean',
        ]);

        $product->update($request->only(['name', 'description', 'is_premium']));

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }

    // Admin: delete product
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}
