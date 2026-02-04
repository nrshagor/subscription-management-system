<?php 
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Plan;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    // Get current user's subscriptions
    public function mySubscriptions(Request $request)
    {
        $subscriptions = Subscription::with('plan.vendor')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($subscriptions);
    }

    // Purchase subscription
    public function purchase(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);

        $user = $request->user();
        $plan = Plan::findOrFail($request->plan_id);

        // Prevent duplicate active subscription for same vendor
        $existing = Subscription::where('user_id', $user->id)
            ->whereHas('plan', function ($q) use ($plan) {
                $q->where('vendor_id', $plan->vendor_id);
            })
            ->where('status', 'active')
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You already have an active subscription for this vendor. Please upgrade instead.'
            ], 400);
        }

        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'start_date' => Carbon::now(),
            'end_date' => Carbon::now()->addMonth(),
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Subscription purchased successfully',
            'subscription' => $subscription
        ], 201);
    }

    // Upgrade subscription
    public function upgrade(Request $request)
    {
        $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id',
            'new_plan_id' => 'required|exists:plans,id',
        ]);

        $user = $request->user();
        $subscription = Subscription::where('id', $request->subscription_id)
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->firstOrFail();

        $newPlan = Plan::findOrFail($request->new_plan_id);

        // Ensure same vendor
        if ($subscription->plan->vendor_id !== $newPlan->vendor_id) {
            return response()->json([
                'message' => 'You can only upgrade within the same vendor.'
            ], 400);
        }

        // Update subscription
        $subscription->update([
            'plan_id' => $newPlan->id,
            'start_date' => Carbon::now(),
            'end_date' => Carbon::now()->addMonth(),
        ]);

        return response()->json([
            'message' => 'Subscription upgraded successfully',
            'subscription' => $subscription
        ]);
    }

    // Expire subscriptions (basic logic)
    public function expireOldSubscriptions()
    {
        $expired = Subscription::where('status', 'active')
            ->whereDate('end_date', '<', Carbon::today())
            ->update(['status' => 'expired']);

        return response()->json([
            'message' => 'Expired subscriptions updated',
            'count' => $expired
        ]);
    }
}
