<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\UserProfileController;

Route::apiResource('properties', PropertyController::class);

// User Profile routes
Route::get('/user/profile', [UserProfileController::class, 'show']);
Route::put('/user/profile', [UserProfileController::class, 'update']);
Route::post('/user/profile/photo', [UserProfileController::class, 'uploadPhoto']);
Route::delete('/user/profile/photo', [UserProfileController::class, 'deletePhoto']);
