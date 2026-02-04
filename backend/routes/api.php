<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\VendorController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});
// Public routes
Route::get('/vendors', [VendorController::class, 'index']);
Route::get('/vendors/{id}', [VendorController::class, 'show']);

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/vendors', [VendorController::class, 'store']);
    Route::put('/vendors/{id}', [VendorController::class, 'update']);
    Route::delete('/vendors/{id}', [VendorController::class, 'destroy']);
});

// Public: get plans by vendor
Route::get('/vendors/{vendorId}/plans', [PlanController::class, 'getByVendor']);

// Admin: manage plans
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/plans', [PlanController::class, 'store']);
    Route::put('/plans/{id}', [PlanController::class, 'update']);
    Route::delete('/plans/{id}', [PlanController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/my-subscriptions', [SubscriptionController::class, 'mySubscriptions']);
    Route::post('/subscribe', [SubscriptionController::class, 'purchase']);
    Route::post('/upgrade', [SubscriptionController::class, 'upgrade']);
    Route::get('/expire-subscriptions', [SubscriptionController::class, 'expireOldSubscriptions']);
});
// User (filtered by subscription)
Route::middleware('auth:sanctum')->get('/products', [ProductController::class, 'index']);

// Admin product management
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});