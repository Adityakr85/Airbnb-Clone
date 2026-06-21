<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\ServiceController;

Route::apiResource('properties', PropertyController::class);
Route::apiResource('experiences', ExperienceController::class);
Route::apiResource('services', ServiceController::class);

// User Profile routes
Route::get('/user/profile', [UserProfileController::class, 'show']);
Route::put('/user/profile', [UserProfileController::class, 'update']);
Route::post('/user/profile/photo', [UserProfileController::class, 'uploadPhoto']);
Route::delete('/user/profile/photo', [UserProfileController::class, 'deletePhoto']);
