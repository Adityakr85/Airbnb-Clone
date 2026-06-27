<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\HostController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\AdminController;

// Additional property endpoints
Route::get('/properties/destinations', [PropertyController::class, 'destinations']);

Route::apiResource('properties', PropertyController::class);
Route::apiResource('experiences', ExperienceController::class);
Route::apiResource('services', ServiceController::class);
Route::post('/properties', [PropertyController::class, 'store']);

// Host routes
Route::get('/host/dashboard', [HostController::class, 'dashboard']);

// Reservation & Trip routes
Route::post('/reservations', [ReservationController::class, 'store']);
Route::get('/reservations/{id}', [ReservationController::class, 'show']);
Route::get('/trips', [ReservationController::class, 'guestTrips']);
Route::patch('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);
Route::patch('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);

// Wishlist routes
Route::get('/wishlist', [WishlistController::class, 'index']);
Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);
Route::get('/wishlist/check', [WishlistController::class, 'check']);

// Review routes
Route::get('/properties/{propertyId}/reviews', [ReviewController::class, 'index']);
Route::post('/properties/{propertyId}/reviews', [ReviewController::class, 'store']);

// Message routes
Route::get('/messages', [MessageController::class, 'inbox']);
Route::get('/messages/unread', [MessageController::class, 'unreadCount']);
Route::get('/messages/{partnerId}', [MessageController::class, 'thread']);
Route::post('/messages', [MessageController::class, 'send']);

// Admin routes
Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
Route::get('/admin/users', [AdminController::class, 'users']);
Route::get('/admin/properties', [AdminController::class, 'properties']);
Route::post('/admin/properties/{id}/approve', [AdminController::class, 'approveProperty']);
Route::post('/admin/properties/{id}/reject', [AdminController::class, 'rejectProperty']);
Route::get('/admin/reservations', [AdminController::class, 'reservations']);
Route::get('/admin/analytics', [AdminController::class, 'analytics']);

// User Profile routes
Route::get('/user/profile', [UserProfileController::class, 'show']);
Route::put('/user/profile', [UserProfileController::class, 'update']);
Route::post('/user/profile/photo', [UserProfileController::class, 'uploadPhoto']);
Route::delete('/user/profile/photo', [UserProfileController::class, 'deletePhoto']);